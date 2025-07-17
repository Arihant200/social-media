import { Injectable,UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService
    ){}

  async register(username: string, password: string) {
    const hashed = await bcrypt.hash(password, 10);
    const user = new this.userModel({ username, password: hashed });
    await user.save();
    return { message: 'User registered' };
  }

  async login(username: string, password: string) {
    const user: UserDocument | null = await this.userModel.findOne({ username });    if (!user) throw new UnauthorizedException('User not found');
    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new UnauthorizedException('Invalid credentials');

    const payload = { username: user.username, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
      username: user.username,
      id: user._id.toHexString() 
    },
    };
  }
}



