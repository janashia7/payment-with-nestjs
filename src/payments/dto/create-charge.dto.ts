import { IsNumber, IsString } from 'class-validator';

export class CreateChargeDto {
  @IsNumber()
  amount: number;

  @IsString()
  source: string;
}
