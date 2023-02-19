import { IsNotEmpty, IsNumberString, Matches } from 'class-validator';

export class CreateTokenDto {
  @IsNotEmpty()
  number: string;

  @IsNotEmpty()
  @IsNumberString()
  exp_month: string;

  @IsNotEmpty()
  @IsNumberString()
  exp_year: string;

  @IsNotEmpty()
  @Matches(/^\d{3}$/)
  cvc: string;
}
