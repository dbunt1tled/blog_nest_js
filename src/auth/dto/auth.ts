import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class Auth {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @IsString()
  password: string;
}