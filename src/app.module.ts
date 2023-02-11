import { PaymentsModule } from './payments/payment.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PaymentsModule, AuthModule],
})
export class AppModule {}
