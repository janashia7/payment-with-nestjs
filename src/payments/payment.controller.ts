import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  Controller,
  Post,
  Body,
  HttpException,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreateTokenDto } from './dto/create-token.dto';
import { CreateChargeDto } from './dto/create-charge.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(JwtAuthGuard)
  @Post('charge')
  async createCharge(@Request() req, @Body() createChargeDto: CreateChargeDto) {
    try {
      const token = req.user.access_token;

      return this.paymentService.createCharge(createChargeDto, token);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  @UseGuards(JwtAuthGuard)
  @Post('token')
  async createToken(@Body() createTokenDto: CreateTokenDto) {
    try {
      const token = await this.paymentService.createToken(createTokenDto);

      return token;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
