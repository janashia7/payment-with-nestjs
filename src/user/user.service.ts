import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(userDto: any) {
    return await this.userRepository.create(userDto);
  }

  async findOne(username: string) {
    return await this.userRepository.findOne(username);
  }

  async addUserPayment(username: string, payment: {}) {
    return await this.userRepository.addUserPayment(username, payment);
  }
}
