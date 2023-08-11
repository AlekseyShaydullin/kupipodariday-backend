import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';
import { UsersService } from '../users/users.service';
import { WishesService } from '../wishes/wishes.service';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
    private readonly usersService: UsersService,
    private readonly wishesService: WishesService,
  ) {}

  async createWishlist(createWishlistDto: CreateWishlistDto, userId: number) {
    const user = await this.usersService.findOneById(userId);
    const wishes = await this.wishesService.findByMany(
      createWishlistDto.itemsId,
    );

    return this.wishlistRepository.save({
      ...createWishlistDto,
      owner: user,
      items: wishes,
    });
  }

  async findAll(): Promise<Wishlist[]> {
    return await this.wishlistRepository.find({
      relations: ['owner', 'items'],
    });
  }

  async findOne(id: number): Promise<Wishlist> {
    const wishList = await this.wishlistRepository.findOne({
      where: { id },
      relations: ['owner', 'items'],
    });

    if (!wishList) {
      throw new BadRequestException('Вишлист не найден');
    }

    return wishList;
  }

  async update(
    id: number,
    updateWishlistDto: UpdateWishlistDto,
    userId: number,
  ): Promise<Wishlist> {
    const wishList = await this.findOne(id);

    if (wishList.owner.id !== userId) {
      throw new BadRequestException(
        'Вы не можете изменить Вишлист других людей',
      );
    }

    if (updateWishlistDto.itemsId) {
      const { itemsId, ...rest } = updateWishlistDto;
      const wishes = await this.wishesService.findByMany(itemsId);
      wishList.items.push(...wishes);
      await this.wishlistRepository.save(wishList);
      await this.wishlistRepository.update(id, rest);
    } else {
      await this.wishlistRepository.update(id, updateWishlistDto);
    }
    return wishList;
  }

  async remove(id: number, userId: number): Promise<Wishlist> {
    const wishList = await this.findOne(id);

    if (wishList.owner.id !== userId) {
      throw new BadRequestException(
        'Вы не можете удалять Вишлист других людей',
      );
    }
    await this.wishlistRepository.delete(id);
    return wishList;
  }
}
