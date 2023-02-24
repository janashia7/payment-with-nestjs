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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetTokenResponse } from './dto/get-token-response.dto';
import { CreateChargeResponse } from './dto/create-charge-response.dto';

@ApiBearerAuth()
@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(JwtAuthGuard)
  @Post('charge')
  @ApiOperation({ summary: 'Create Payment' })
  @ApiResponse({
    status: 201,
    type: CreateChargeResponse,
  })
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
  @ApiOperation({ summary: 'Get Stripe Token' })
  @ApiResponse({
    status: 201,
    type: GetTokenResponse,
  })
  async createToken(@Body() createTokenDto: CreateTokenDto) {
    try {
      const token = await this.paymentService.createToken(createTokenDto);

      return token;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
