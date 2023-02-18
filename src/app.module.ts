import { PaymentsModule } from './payments/payment.module';
import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from 'dotenv';
config();

@Module({
  imports: [
    UserModule,
    PaymentsModule,
    MongooseModule.forRoot(process.env.MONGO_URL),
  ],
})
export class AppModule {}
