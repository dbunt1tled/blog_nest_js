import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class EmailConfirmResend {
  @IsNotEmpty({ message: 'validation.NOT_EMPTY' })
  @IsEmail({}, { message: 'validation.INVALID_EMAIL' })
  email: string;
}