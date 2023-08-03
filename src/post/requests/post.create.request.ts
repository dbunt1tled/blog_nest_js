import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PostStatus } from '../enum/post.status';

export class PostCreateRequest {
  @IsNotEmpty()
  title: string;
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  content: string;
  @IsNotEmpty()
  @IsEnum(PostStatus)
  status: PostStatus;
}
