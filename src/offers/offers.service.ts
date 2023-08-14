import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';
import { WishesService } from '../wishes/wishes.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
    private readonly wishesService: WishesService,
    private readonly usersService: UsersService,
  ) {}

  async createOffer(
    createOfferDto: CreateOfferDto,
    id: number,
  ): Promise<Offer> {
    const user = await this.usersService.findOneById(id);
    const { itemId, amount } = createOfferDto;
    const wish = await this.wishesService.findOne({
      where: { id: itemId },
      relations: { owner: true },
    });

    if (!wish) {
      throw new NotFoundException(`Подарок не найден`);
    }
    if (wish.owner.id === user.id) {
      throw new ForbiddenException(`Простите, но вы не можете вносить деньги`);
    }

    const { price, raised } = wish;
    if (amount + raised > price) {
      throw new ForbiddenException(
        `В данный момент, вы не можете заплатить больше, чем 
        ${price - raised} RUB`,
      );
    }

    await this.wishesService.updateWish(
      itemId,
      { raised: amount + raised },
      wish.owner.id,
    );

    const offer = this.offerRepository.create({
      ...createOfferDto,
      owner: user,
      item: wish,
    });

    return this.offerRepository.save(offer);
  }

  async findAll(): Promise<Offer[]> {
    return await this.offerRepository.find({
      where: {},
      relations: { owner: true, item: true },
    });
  }

  async findOne(id: number): Promise<Offer> {
    return await this.offerRepository.findOne({
      where: { id },
    });
  }
}
