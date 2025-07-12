import {
  Controller,
  Post as HttpPost,
  Get,
  Body,
  UseGuards,
  Request,
  UploadedFile,
  UseInterceptors,
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
}
