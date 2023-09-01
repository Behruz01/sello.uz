import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/infra/entities/user.entity';
import { UserRepo } from 'src/infra/repositories/user.repo';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import stripe from 'stripe';
import { PayDto } from './dto/pay.dto';

interface forUser extends Request {
  verify?: {
    user_id: number;
  };
}

const stripeService = new stripe(
  'sk_test_51NXaxAAt0rSDCgqM2zhoQlb5lKE7gCQ4uH19YMoS6xXVZpm8yfjio8C0Bfpzmew29GqBmxK0PvB8UsgurGRXw5tM007HiNxviT',
  { apiVersion: '2023-08-16' },
);

@Injectable()
export class WalletService {
  constructor(@InjectRepository(User) private readonly userRepo: UserRepo) {}

  async create(createWalletDto: CreateWalletDto, req: forUser) {
    try {
      const { amount, payment_id, user_id } = createWalletDto;

      const paymentIntent = await stripeService.paymentIntents.create({
        amount,
        currency: 'usd',
        confirm: true,
        payment_method: payment_id, // Provide the payment method ID
        return_url: 'https://10.10.1.25:3000/api/wallet',
      });

      const user = await this.userRepo.findOne({ where: { id: user_id } });
      const newBalance = user.balance + amount;

      await this.userRepo.update({ id: user_id }, { balance: newBalance });

      return { message: 'Success' };
    } catch (error) {
      return { message: error.message };
    }
  }

  async pay(paymentDto: PayDto, req: forUser) {
    const { user_id } = req.verify;
    const { amount } = paymentDto;
    const user = await this.userRepo.findOne({ where: { id: user_id } });

    if (!user) return { message: 'User not found!' };

    if (user.balance < amount)
      return {
        message: `You don't have enough funds in your wallet. Please fill your wallet. Your balance: ${user.balance}`,
      };

    const newBalance = user.balance - amount;
    await this.userRepo.update({ id: user_id }, { balance: newBalance });
    return { message: 'The payment was made successfully' };
  }
}