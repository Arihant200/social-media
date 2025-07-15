import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CommentDocument = Comment & Document;

@Schema({ timestamps: true })
export class Comment {
  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  postId: string;

  @Prop({ required: true })
  authorId: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
