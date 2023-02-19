import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { config } from 'dotenv';
import { CustomJwtPayload } from '../interfaces/jwt-payload.interface';
config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: CustomJwtPayload): Promise<{
    access_token: string;
  }> {
    const user = await this.authService.login(payload);

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
