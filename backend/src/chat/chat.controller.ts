import {
  Controller, Post, Get, Body, Request, Param, UseGuards
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('chat')
@UseGuards(AuthGuard('jwt'))
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post(':receiverId')
  async sendMessage(
    @Param('receiverId') receiverId: string,
    @Body('content') content: string,
    @Request() req
  ) {
    return this.chatService.sendMessage(req.user.userId, receiverId, content);
  }

  @Get(':userId')
  async getMessages(@Param('userId') userId: string, @Request() req) {
    return this.chatService.getMessagesBetweenUsers(req.user.userId, userId);
  }
}
