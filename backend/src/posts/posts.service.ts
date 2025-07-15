import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { Model } from 'mongoose';
import { CreatePostDto } from './dto/create-post.dto';
import { NotFoundException } from '@nestjs/common';
@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async create(createPostDto: CreatePostDto, authorId: string, imageUrl?: string): Promise<Post> {
    const created = new this.postModel({ ...createPostDto, authorId ,imageUrl});
    return created.save();
  }

  async findAll(): Promise<Post[]> {
    return this.postModel.find().sort({ createdAt: -1 });
  }

  async findOne(id: string): Promise<Post|null> {
  return this.postModel.findById(id);
}

async like(postId: string, userId: string): Promise<Post> {
    const post = await this.postModel.findById(postId);
    if (!post) throw new NotFoundException('Post not found');

    if (!post.likedBy.includes(userId)) {
      post.likedBy.push(userId);
      await post.save();
    }
    return post;
  }

  async unlike(postId: string, userId: string): Promise<Post> {
    const post = await this.postModel.findById(postId);
    if (!post) throw new NotFoundException('Post not found');

    post.likedBy = post.likedBy.filter(id => id !== userId);
    await post.save();
    return post;
  }
}
