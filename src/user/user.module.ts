import { Global, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { IsUniqueDatabase } from './decorators';
import { UserResponseService } from './user.response.service';
import { PostService } from '../post/post.service';

@Global()
@Module({
  controllers: [UserController],
  providers: [UserService, UserResponseService, IsUniqueDatabase, PostService],
  exports: [UserService, UserResponseService, PostService],
})
export class UserModule {}
