import { Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Product } from './product.entity';
import { User } from './user.entity';

@Entity({ name: 'baskets' })
export class Basket extends BaseEntity {
  @ManyToOne(() => User, (user) => user.basket)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Product, (product) => product.basket)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
