import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsString, ValidateIf } from 'class-validator';
import { UserStatus } from '../enums/user.status';
import { Role } from '../enums/role';
import { isDBUnique, Match } from '../decorators';

export class UserUpdateRequest {
  @IsNotEmpty({ message: 'validation.NOT_EMPTY' })
  @IsNumber({}, { message: 'validation.INVALID_EMAIL' })
  id: number;
  @IsEmail({}, { message: 'validation.INVALID_EMAIL' })
  @isDBUnique('user', 'email', 'id')
  email?: string;
  @IsString()
  password?: string;
  @ValidateIf((o) => <boolean>o.password)
  @IsNotEmpty()
  @IsString()
  @Match('password')
  passwordConfirm?: string;
  @IsString()
  name: string;
  @IsEnum(UserStatus)
  status?: UserStatus;
  @IsEnum(Role)
  role?: Role;
}