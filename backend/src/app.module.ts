// app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { FeedModule } from './feed/feed.module';
import { ChatModule } from './chat/chat.module';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        ({ uri: configService.get<string>('MONGO_URI') }),
    }),
    UsersModule,
    AuthModule,
    PostsModule,
    FeedModule,
    ChatModule,
    CommentsModule,
    
  ],
})
export class AppModule {}
