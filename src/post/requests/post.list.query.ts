import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PaginationQuery } from '../../connectors/requests';
import { PaginationRequest } from '../../connectors/requests/pagination/pagination.request';
import { PostStatus } from '../enum/post.status';

class Filter {
  @IsOptional()
  @IsString()
  titleSearch?: string;
  @IsOptional()
  @IsNumber()
  authorId?: number;
  @IsOptional()
  @IsArray()
  @IsEnum(PostStatus, { each: true })
  status?: PostStatus;
}

export class PostListQuery implements PaginationRequest {
  @ValidateNested()
  @Type(() => Filter)
  filter: Filter;
  @IsOptional()
  @IsString()
  include?: string | null;

  @Transform((i) => parseInt(i.value))
  @IsNumber()
  limit = 10;
  @Transform((i) => parseInt(i.value))
  @IsNumber()
  page = 1;
  @IsOptional()
  sortBy?: PaginationQuery;
}
