import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserStatus } from '../enums/user.status';
import { Role } from '../enums/role';
import { isDBUnique, Match } from '../decorators';

export class UserCreateRequest {
  @IsNotEmpty({ message: 'validation.NOT_EMPTY' })
  @IsEmail({}, { message: 'validation.INVALID_EMAIL' })
  @isDBUnique('user', 'email', 'id')
  email: string;
  @IsNotEmpty({ message: 'validation.NOT_EMPTY' })
  @IsString()
  password: string;
  @IsNotEmpty({ message: 'validation.NOT_EMPTY' })
  @IsString()
  @Match('password')
  passwordConfirm: string;
  @IsNotEmpty({ message: 'validation.NOT_EMPTY' })
  @IsString()
  name: string;
  @IsNotEmpty({ message: 'validation.NOT_EMPTY' })
  @IsEnum(UserStatus)
  status: UserStatus;
  @IsNotEmpty({ message: 'validation.NOT_EMPTY' })
  @IsEnum(Role)
  role: Role;
}