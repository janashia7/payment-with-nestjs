import {
  Body,
  Controller,
  HttpException,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../auth/auth.service';
import { LocalAuthGuard } from '../auth/guards/local-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserResponse } from './dto/login-user-response.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserResponse } from './dto/register-user-response.dto';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('signup')
  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({
    status: 201,
    type: RegisterUserResponse,
  })
  async signup(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.userService.create(createUserDto);
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({
    status: 201,
    type: LoginUserResponse,
  })
  async signin(@Request() req) {
    try {
      return this.authService.login(req.user);
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }
}
