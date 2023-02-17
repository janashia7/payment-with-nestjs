import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.model';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(userDto: any): Promise<User> {
    const a = await this.userModel.create(userDto);

    return this.userModel
      .findOne({ nickname: userDto.nickname })
      .select(['nickname', 'fullName', '-_id']);
  }

  async findOne(username: string) {
    return await this.userModel.findOne({ username });
  }

  async addUserPayment(username: string, payment: {}) {
    return await this.userModel
      .findOneAndUpdate(
        { username },
        { $push: { payments: payment } },
        { new: true },
      )
      .select('username payments');
  }
}
