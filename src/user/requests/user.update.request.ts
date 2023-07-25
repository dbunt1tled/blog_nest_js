import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserStatus } from '../enums/user.status';
import { Role } from '../enums/role';

export class UserUpdateRequest {
  @IsEmail({}, { message: 'validation.INVALID_EMAIL' })
  email?: string;
  @IsString()
  password?: string;
  @IsString()
  name?: string;
  @IsEnum(UserStatus)
  status?: UserStatus;
  @IsEnum(Role)
  role?: Role;
}