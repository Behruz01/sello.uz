import { Repository } from 'typeorm';
import { Product } from '../entities/Product.entity';

export type ProductRepo = Repository<Product>;
