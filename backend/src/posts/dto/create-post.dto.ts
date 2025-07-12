import { IsString, IsOptional, IsUrl } from 'class-validator';

export class CreatePostDto {
  @IsString()
  content: string;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;
}
