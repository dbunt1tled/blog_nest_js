import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PostStatus } from '../enum/post.status';

export class PostUpdateRequest {
  @IsNotEmpty()
  @IsNumber()
  id: number;
  @IsOptional()
  @IsString()
  content?: string;
  @IsOptional()
  @IsString()
  title?: string;
  @IsEnum(PostStatus)
  status?: PostStatus;
}
