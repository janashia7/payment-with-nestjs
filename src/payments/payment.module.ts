import { UserModule } from './../user/user.module';
import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StripeModule } from 'nestjs-stripe';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import * as dotenv from 'dotenv';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

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
