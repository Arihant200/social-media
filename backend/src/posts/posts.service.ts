import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { Model } from 'mongoose';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async create(createPostDto: CreatePostDto, authorId: string, imageUrl?: string): Promise<any> {
    const created = new this.postModel({ ...createPostDto, authorId, imageUrl });
    const saved = await created.save();
    const populated = await saved.populate('authorId', 'username avatar');
    return this.transformPost(populated);
  }

  async findByAuthor(authorId: string): Promise<any[]> {
    const posts = await this.postModel
      .find({ authorId })
      .sort({ createdAt: -1 })
      .populate('authorId', 'username avatar');

    return posts.map(this.transformPost);
  }

  async findAll(): Promise<any[]> {
    const posts = await this.postModel
      .find()
      .sort({ createdAt: -1 })
      .populate('authorId', 'username avatar');

    return posts.map(this.transformPost);
  }

  async findOne(id: string): Promise<any | null> {
    const post = await this.postModel
      .findById(id)
      .populate('authorId', 'username avatar');

    return post ? this.transformPost(post) : null;
  }

  async toggleLike(postId: string, userId: string): Promise<{ liked: boolean }> {
    const post = await this.postModel.findById(postId);
    if (!post) throw new NotFoundException('Post not found');

    const alreadyLiked = post.likedBy.includes(userId);
    post.likedBy = alreadyLiked
      ? post.likedBy.filter(id => id !== userId)
      : [...post.likedBy, userId];

    await post.save();
    return { liked: !alreadyLiked };
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

  // ✅ Utility to format post shape
  private transformPost = (post: PostDocument): any => {
    const obj = post.toObject();
    obj.author = obj.authorId;
    delete obj.authorId;
    return obj;
  };
}
