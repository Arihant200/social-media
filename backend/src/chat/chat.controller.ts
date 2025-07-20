import {
  Controller, Post, Get, Body, Request, Param, UseGuards
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('chat')
@UseGuards(AuthGuard('jwt'))
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

 // chat.controller.ts
@Post('send')
async sendMessage(@Body() body: { senderId: string; receiverId: string; message: string }) {
    console.log('Received message body:', body);
  return this.chatService.sendMessage(body.senderId, body.receiverId, body.message);
}

  
  @Get(':userId')
  async getMessages(@Param('userId') userId: string, @Request() req) {
    return this.chatService.getMessagesBetweenUsers(req.user.userId, userId);
  }
}
