import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { LocalAuthGuard } from '../auth/guards/local-auth.guard';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('signup')
  async signup(@Body() userDto: any) {
    try {
      return await this.userService.create(userDto);
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signin(@Request() req) {
    try {
      return this.authService.login(req.user);
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }
}
