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

class Filter {
  @IsOptional()
  @IsEmail({}, { message: 'validation.INVALID_EMAIL' })
  @isDBUnique('user', 'email')
  emailSearch?: string;
  @IsOptional()
  @IsString()
  nameSearch?: string;
  @IsOptional()
  @IsArray()
  @IsEnum(UserStatus, { each: true })
  status?: UserStatus;
  @IsOptional()
  @IsArray()
  @IsEnum(Role, { each: true })
  role?: Role[];
}

export class UserListQuery implements PaginationRequest {
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
