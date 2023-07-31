import { Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/base-entity/base.entity';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';

@Entity()
export class Wishlist extends BaseEntity {
  @ManyToOne(() => User, (user) => user.wishlists)
  owner: User;

  @OneToMany(() => Wish, (wish) => wish.wishList)
  items: Wish[];
}
