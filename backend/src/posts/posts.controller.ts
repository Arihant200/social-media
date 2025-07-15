import {
  Controller,
  Post as HttpPost,
  Get,
  Body,
  UseGuards,
  Request,
  UploadedFile,
  UseInterceptors,
  Param,
  NotFoundException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import cloudinary from '../cloudinary/cloudinary.provider';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(AuthGuard('jwt'))
  @HttpPost()
  @UseInterceptors(FileInterceptor('image')) 
  async create(
    @Body() createPostDto: CreatePostDto,
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    let imageUrl: string | undefined;

    if (file) {
      const upload = await cloudinary.uploader.upload(file.path, {
        folder: 'posts',
      });
      imageUrl = upload.secure_url;
    }

    return this.postsService.create(createPostDto, req.user.userId, imageUrl);
  }

  @Get()
  async findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
async findOne(@Param('id') id: string) {
 const post = await this.postsService.findOne(id);
    if (!post) {
      throw new NotFoundException(`Post with ID "${id}" not found`);
    }
    return post;
}

 @UseGuards(AuthGuard('jwt'))
  @HttpPost(':id/like')
  async like(@Param('id') postId: string, @Request() req) {
    return this.postsService.like(postId, req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @HttpPost(':id/unlike')
  async unlike(@Param('id') postId: string, @Request() req) {
    return this.postsService.unlike(postId, req.user.userId);
  }
}
