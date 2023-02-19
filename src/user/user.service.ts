import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcrypt';
import {
  DatabaseException,
  UserAlreadyExistsException,
  UserNotFoundException,
} from '../errors/user.exception';
import { UserResponse } from './interfaces/user-message.interface';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponse> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltRounds,
    );

    try {
      await this.userRepository.create(createUserDto, hashedPassword);

      return {
        success: true,
        message: 'User registered successfully',
      };
    } catch (error) {
      if (error.code === 11000) {
        throw new UserAlreadyExistsException(createUserDto.username);
      } else {
        throw new DatabaseException('Failed to create user', error);
      }
    }
  }

  async findOne(username: string) {
    const user = await this.userRepository.findOne(username);

    if (!user) {
      throw new UserNotFoundException(username);
    }

    return user;
  }

  async addUserPayment(username: string, payment: object) {
    return this.userRepository.addUserPayment(username, payment);
  }
}
