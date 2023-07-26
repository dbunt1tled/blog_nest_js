import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserStatus } from '../enums/user.status';
import { Role } from '../enums/role';
import { isDBUnique, Match } from '../decorators';
import { Transform } from 'class-transformer';

export class UserListRequest {
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
