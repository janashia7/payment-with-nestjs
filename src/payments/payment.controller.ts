import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('charge')
  async createCharge(
    @Body('amount') amount: number,
    @Body('source') source: string,
  ) {
    try {
      const a = await this.paymentService.createCharge(amount, source);
      return a;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('token')
  async createToken(
    @Body('card_number') number: string,
    @Body('exp_month') exp_month: string,
    @Body('exp_year') exp_year: string,
    @Body('cvc') cvc: string,
  ) {
    try {
      const token = await this.paymentService.createToken(
        number,
        exp_month,
        exp_year,
        cvc,
      );

      return token;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
