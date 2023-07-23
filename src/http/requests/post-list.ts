import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

export class PostListRequest {
  @IsString()
  readonly name: string;
  @IsNumber()
  @IsOptional()
  readonly limit: number = 100;
}
