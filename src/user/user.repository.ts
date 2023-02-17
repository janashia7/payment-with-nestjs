import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.model';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(userDto: any): Promise<User> {
    console.log("🚀 ~ file: user.repository.ts:11 ~ UserRepository ~ create ~ userDto", userDto)
    return await this.userModel.create(userDto);
  }

  async findOne(username: string) {
    console.log(
      '🚀 ~ file: user.repository.ts:19 ~ UserRepository ~ findOne ~ username',
      username,
    );

    return await this.userModel.findOne({ username });
  }
}
