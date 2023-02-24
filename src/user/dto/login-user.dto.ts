import { IsNotEmpty, MinLength, MaxLength, Matches } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/^(?=.*[a-zA-Z])[a-zA-Z0-9]+$/, {
    message: 'Username must only contain letters and numbers',
  })
  username: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
