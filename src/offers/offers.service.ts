import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';
import { WishesService } from '../wishes/wishes.service';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
    private readonly wishesService: WishesService,
  ) {}

  async createOffer(createOfferDto: CreateOfferDto) {
    const { itemId, amount } = createOfferDto;
    const wish = await this.wishesService.findOne({
      where: { id: itemId },
      relations: { owner: true },
    });

    return 'This action adds a new offer';
  }

  findAll() {
    return `This action returns all offers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} offer`;
  }

  remove(id: number) {
    return `This action removes a #${id} offer`;
  }
}
