import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument } from './schemas/comment.schema';
import { Model } from 'mongoose';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(@InjectModel(Comment.name) private commentModel: Model<CommentDocument>) {}

  async create(createCommentDto: CreateCommentDto, authorId: string): Promise<Comment> {
    const created = new this.commentModel({ ...createCommentDto, authorId });
    return created.save();
  }

  async findByPost(postId: string): Promise<Comment[]> {
    return this.commentModel.find({ postId }).sort({ createdAt: -1 });
  }
}
