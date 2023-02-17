import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(JwtAuthGuard)
  @Post('charge')
  async createCharge(@Request() req,
    @Body('amount') amount: number,
    @Body('source') source: string,
  ) {
    try {
      console.log(req.user);
      
      return this.paymentService.createCharge(amount, source);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  @UseGuards(JwtAuthGuard)
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
