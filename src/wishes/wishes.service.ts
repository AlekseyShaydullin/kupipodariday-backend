import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, In, Repository } from 'typeorm';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
  ) {}

  create(createWishDto: CreateWishDto, owner: User) {
    const newWish = this.wishRepository.create({
      ...createWishDto,
      owner,
    });
    return this.wishRepository.create(newWish);
  }

  async findOne(query: FindOneOptions<Wish>): Promise<Wish> {
    return await this.wishRepository.findOne(query);
  }

  async findByMany(giftsId: number[]): Promise<Wish[]> {
    return await this.wishRepository.find({
      where: { id: In(giftsId) },
    });
  }

  async updateWish(id: number, updateWishDto: UpdateWishDto, ownerId: number) {
    const wish = await this.findOne({
      where: { id },
      relations: { owner: true },
    });

    if (!wish) {
      throw new NotFoundException(`Подарок не найден`);
    }
    if (wish.owner.id !== ownerId) {
      throw new NotAcceptableException(`Этот подарок другого пользователя`);
    }

    await this.wishRepository.save({ ...wish, ...updateWishDto });

    return await this.findOne({
      where: { id },
      relations: { owner: true },
    });
  }

  async removeWish(id: number, ownerId: number): Promise<Wish> {
    const wish = await this.findOne({
      where: { id },
      relations: { owner: true },
    });

    if (!wish) {
      throw new NotFoundException(`Подарок не найден`);
    }
    if (wish.owner.id !== ownerId) {
      throw new NotAcceptableException(`Этот подарок другого пользователя`);
    }

    await this.wishRepository.delete(id);

    return wish;
  }
}
