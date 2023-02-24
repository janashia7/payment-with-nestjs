import { ApiProperty } from '@nestjs/swagger';
import { PaymentInfoDto } from './payment-info.dto';

export class CreateChargeResponse {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  username: string;

  @ApiProperty({ type: [PaymentInfoDto] })
  payments: PaymentInfoDto[];
}
