import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserResponse {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'User registered successfully' })
  message: string;
}
