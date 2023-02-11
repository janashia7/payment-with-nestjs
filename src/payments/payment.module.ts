import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StripeModule } from 'nestjs-stripe';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import * as dotenv from 'dotenv';

dotenv.config();

console.log(process.env.STRIPE_API_KEY);

@Module({
  imports: [
    StripeModule.forRoot({
      apiKey: process.env.STRIPE_API_KEY,
      apiVersion: '2020-08-27',
    }),
  ],
  controllers: [PaymentController],
  providers: [PaymentService, ConfigService],
})
export class PaymentsModule {}
