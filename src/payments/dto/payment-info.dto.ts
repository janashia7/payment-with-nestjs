import { ApiProperty } from '@nestjs/swagger';
import { Stripe } from 'stripe';

export class PaymentInfoDto {
  @ApiProperty({ example: 'cus_customerid' })
  cus: string | Stripe.Customer | Stripe.DeletedCustomer;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  currency: string;

  @ApiProperty()
  paid: boolean;

  @ApiProperty()
  type: string;

  @ApiProperty()
  brand: string;

  @ApiProperty()
  country: string;

  @ApiProperty()
  last4: string;

  @ApiProperty()
  receipt_url: string;

  @ApiProperty()
  date: Date;
}
