import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
@Module({
  imports: [
    // This line registers the UserSchema and makes the UserModel available for injection
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  ],
  exports: [MongooseModule,UsersService],

  providers: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}
