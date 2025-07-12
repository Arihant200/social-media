import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {}

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).select('-password'); // don't return password
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateProfile(id: string, update: Partial<User>): Promise<User> {
    const user = await this.userModel.findByIdAndUpdate(id, update, { new: true }).select('-password');
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
