import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {}

async findAll(): Promise<UserDocument[]> {
   
    return this.userModel.find().select('-password').exec();
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).select('-password'); // don't return password
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

   async findByName(name: string): Promise<User[]> {
    return this.userModel.find({
      username: { $regex: name, $options: 'i' }, 
    }).select('username _id');
  }

  async updateProfile(id: string, update: Partial<User>): Promise<User> {
    const user = await this.userModel.findByIdAndUpdate(id, update, { new: true }).select('-password');
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
