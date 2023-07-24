import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignUp {
  @IsNotEmpty({ message: 'validation.NOT_EMPTY' })
  @IsString()
  name: string;
  @IsNotEmpty({ message: 'validation.NOT_EMPTY' })
  @IsEmail({}, { message: 'validation.INVALID_EMAIL' })
  email: string;
  @IsNotEmpty({ message: 'validation.NOT_EMPTY' })
  @IsString()
  password: string;
}