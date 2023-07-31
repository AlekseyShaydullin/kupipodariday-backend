import { Entity, OneToMany } from 'typeorm';
import { Wish } from 'src/wishes/entities/wish.entity';
import { BaseEntity } from 'src/base-entity/base.entity';
import { Wishlist } from 'src/wishlists/entities/wishlist.entity';
import { Offer } from 'src/offers/entities/offer.entity';

@Entity()
export class User extends BaseEntity {
  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  wishlists: Wishlist[];

  @OneToMany(() => Offer, (offer) => offer.owner)
  offers: Offer[];
}
