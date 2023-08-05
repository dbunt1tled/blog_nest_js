import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PaginationQuery } from '../../connectors/requests';
import { PaginationRequest } from '../../connectors/requests/pagination/pagination.request';
import { isDBUnique } from '../decorators';
import { Role } from '../enums/role';
import { UserStatus } from '../enums/user.status';
import { ApiProperty } from '@nestjs/swagger';

class Filter {
  @IsOptional()
  @IsEmail({}, { message: 'validation.INVALID_EMAIL' })
  @isDBUnique('user', 'email')
  @ApiProperty({
    example: 'email',
    required: false,
    description: 'Search by user email',
  })
  emailSearch?: string;
  @ApiProperty({
    example: 'name',
    required: false,
    description: 'Search by user name',
  })
  @IsOptional()
  @IsString()
  nameSearch?: string;
  @ApiProperty({
    isArray: true,
    required: false,
    type: 'number',
    example: 1,
    description: 'Filter by user status',
  })
  @IsOptional()
  @IsArray()
  @IsEnum(UserStatus, { each: true })
  status?: UserStatus;
  @IsOptional()
  @IsArray()
  @IsEnum(Role, { each: true })
  @ApiProperty({
    isArray: true,
    required: false,
    type: 'string',
    example: 1,
    description: 'Filter by user status',
  })
  role?: Role[];
}

export class UserListQuery implements PaginationRequest {
  @ValidateNested()
  @Type(() => Filter)
  @ApiProperty({
    type: Filter,
    required: false,
  })
  filter: Filter;
  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'post',
    required: false,
    description: 'List of relations',
  })
  include?: string | null;

  @Transform((i) => parseInt(i.value))
  @IsNumber()
  @ApiProperty({
    example: 1,
    default: 10,
    required: false,
    description: 'Count rows on page',
  })
  limit = 10;
  @Transform((i) => parseInt(i.value))
  @IsNumber()
  @ApiProperty({
    example: 1,
    default: 1,
    required: false,
    description: 'Current page',
  })
  page = 1;
  @ApiProperty({
    example: 'name:asc',
    required: false,
    description: 'Sort order',
  })
  @IsOptional()
  sortBy?: PaginationQuery;
}
