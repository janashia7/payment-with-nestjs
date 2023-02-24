import { ApiProperty } from '@nestjs/swagger';

export class GetTokenResponse {
  @ApiProperty({ example: 'tok_token' })
  token: string;
}
