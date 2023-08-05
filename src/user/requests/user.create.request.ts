import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserStatus } from '../enums/user.status';
import { Role } from '../enums/role';
import { isDBUnique, Match } from '../decorators';
import { ApiProperty } from '@nestjs/swagger';

export class UserCreateRequest {
  @IsNotEmpty({ message: 'validation.NOT_EMPTY' })
  @IsEmail({}, { message: 'validation.INVALID_EMAIL' })
  @isDBUnique('user', 'email')
  @ApiProperty({
    example: 'jhon@example.com',
    description: 'User email',
  })
  email: string;
  @IsNotEmpty({ message: 'validation.NOT_EMPTY' })
  @IsString()
  @ApiProperty({
    example: 'random string',
    description: 'User password',
  })
  password: string;
  @IsNotEmpty({ message: 'validation.NOT_EMPTY' })
  @IsString()
  @Match('password')
  @ApiProperty({
    example: 'random string',
    description: 'User password confirmation as the same password',
  })
  passwordConfirm: string;
  @IsNotEmpty({ message: 'validation.NOT_EMPTY' })
  @IsString()
  @ApiProperty({
    example: 'Jhon',
    description: 'User name',
  })
  name: string;
  @IsNotEmpty({ message: 'validation.NOT_EMPTY' })
  @IsEnum(UserStatus)
  @ApiProperty({
    example: 1,
    description: 'User status',
    enum: UserStatus,
  })
  status: UserStatus;
  @IsNotEmpty({ message: 'validation.NOT_EMPTY' })
  @IsEnum(Role)
  @ApiProperty({
    example: 'admin',
    description: 'User role',
  })
  role: Role;
}