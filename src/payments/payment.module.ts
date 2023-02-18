import { UserModule } from './../user/user.module';
import { Module } from '@nestjs/common';
import { StripeModule } from 'nestjs-stripe';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import * as dotenv from 'dotenv';
import { JwtService } from '@nestjs/jwt';

dotenv.config();

@Module({
  imports: [
    UserModule,
    StripeModule.forRoot({
      apiKey: process.env.STRIPE_API_KEY,
      apiVersion: '2020-08-27',
    }),
  ],
  controllers: [PaymentController],
  providers: [PaymentService, JwtService],
})
export class PaymentsModule {}
