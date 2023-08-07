import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import {
  IsDecimal,
  IsNumber,
  IsPositive,
  IsUrl,
  Length,
} from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { BaseEntity } from 'src/base-entity/base.entity';
import { Offer } from 'src/offers/entities/offer.entity';
import { Wishlist } from 'src/wishlists/entities/wishlist.entity';

@Entity()
export class Wish extends BaseEntity {
  @Column({
    type: 'varchar',
  })
  @Length(1, 250)
  name: string;

  @Column({
    type: 'varchar',
  })
  @IsUrl()
  link: string;

  @Column({
    type: 'varchar',
  })
  @IsUrl()
  image: string;

  @Column({
    type: 'float',
  })
  @IsNumber({
    maxDecimalPlaces: 2,
  })
  @IsPositive()
  price: number;

  @Column({
    type: 'float',
  })
  @IsNumber({
    maxDecimalPlaces: 2,
  })
  @IsPositive()
  raised: number;

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @Column({
    type: 'varchar',
  })
  @Length(1, 1024)
  description: string;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  @Column({
    type: 'int',
    default: 0,
  })
  @IsDecimal()
  copied: number;

  @ManyToOne(() => Wishlist, (wishList) => wishList.items)
  wishList: Wishlist;
}