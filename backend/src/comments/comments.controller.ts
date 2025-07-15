import {
  Controller,
  Post as HttpPost,
  Body,
  UseGuards,
  Request,
  Get,
  Query,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(AuthGuard('jwt'))
  @HttpPost()
  async create(@Body() dto: CreateCommentDto, @Request() req) {
    return this.commentsService.create(dto, req.user.userId);
  }

  @Get()
  async findByPost(@Query('postId') postId: string) {
    return this.commentsService.findByPost(postId);
  }
}
