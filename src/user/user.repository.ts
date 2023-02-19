import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './user.model';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(
    createUserDto: CreateUserDto,
    hashedPassword: string,
  ): Promise<User> {
    return this.userModel.create({
      ...createUserDto,
      password: hashedPassword,
    });
  }

  async findOne(username: string) {
    return this.userModel.findOne({ username });
  }

  async addUserPayment(username: string, payment: object): Promise<User> {
    return this.userModel
      .findOneAndUpdate(
        { username },
        { $push: { payments: payment } },
        { new: true },
      )
      .select('username payments');
  }
}
