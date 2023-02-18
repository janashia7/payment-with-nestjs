import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcrypt';
import { UserNotFoundException } from '../errors/user.exception';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(userDto: any) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userDto.password, saltRounds);

    await this.userRepository.create(userDto, hashedPassword);

    return {
      success: true,
      message: 'User registered successfully',
    };
  }

  async findOne(username: string) {
    const user = await this.userRepository.findOne(username);

    if (!user) {
      throw new UserNotFoundException(username);
    }

    return user;
  }

  async addUserPayment(username: string, payment: {}) {
    return this.userRepository.addUserPayment(username, payment);
  }
}
