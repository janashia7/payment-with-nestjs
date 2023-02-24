import { ApiProperty } from '@nestjs/swagger';

export class LoginUserResponse {
  @ApiProperty({ example: 'jwttoken' })
  access_token: string;
}
