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
  NotFoundException,
  BadRequestException,
  Query,

} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import cloudinary from '../cloudinary/cloudinary.provider';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs/promises'; 

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(AuthGuard('jwt'))
  @HttpPost()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const ext = extname(file.originalname);
          const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),

    }),
  )
  async create(
    @Body() createPostDto: CreatePostDto,
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    let imageUrl: string | undefined;
    let tempFilePath: string | undefined; 

    try { 
      if (!file || !file.path) {
        console.error('File or file path is missing after Multer processing.');
        throw new BadRequestException('Image file is required or failed to process.');
      }

      tempFilePath = file.path; 

      if (file) {
        const upload = await cloudinary.uploader.upload(file.path, {
          folder: 'posts',
        });
        imageUrl = upload.secure_url;
      }

      return this.postsService.create(createPostDto, req.user.userId, imageUrl);
    } finally { 
      if (tempFilePath) {
        try {
          await fs.unlink(tempFilePath); 
          console.log(`Temporary file deleted: ${tempFilePath}`);
        } catch (unlinkError) {
          console.error(`Error deleting temporary file ${tempFilePath}:`, unlinkError);
        }
      }
    } 
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

  @Get()
  async find(@Query('authorId') authorId?: string) {
    if (authorId) {
      return this.postsService.findByAuthor(authorId);
    }
    return this.postsService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
@HttpPost(':id/like')
async toggleLike(@Param('id') postId: string, @Request() req) {
  return this.postsService.toggleLike(postId, req.user.userId);
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
