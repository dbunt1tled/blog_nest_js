import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString, ValidateNested
} from 'class-validator';
import { UserStatus } from '../enums/user.status';
import { Role } from '../enums/role';
import { isDBUnique, Match } from '../decorators';
import { Transform, Type } from 'class-transformer';

class Filter {
  @IsOptional()
  @IsEmail({}, { message: 'validation.INVALID_EMAIL' })
  @isDBUnique('user', 'email')
  emailSearch: string;
  @IsOptional()
  @IsString()
  nameSearch: string;
  @IsOptional()
  @IsArray()
  @IsEnum(UserStatus, { each: true })
  status?: UserStatus;
  @IsOptional()
  @IsArray()
  @IsEnum(Role, { each: true })
  role?: Role[];
}

export class UserListQuery {
  @ValidateNested()
  @Type(() => Filter)
  filter: Filter;
  @IsOptional()
  @IsString()
  include?: string|null;
}
