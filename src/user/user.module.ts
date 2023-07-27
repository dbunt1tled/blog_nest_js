import { Global, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { IsUniqueDatabase } from './decorators';
import { UserResponseService } from './user.response.service';

@Global()
@Module({
  controllers: [UserController],
  providers: [UserService, UserResponseService, IsUniqueDatabase],
  exports: [UserService, UserResponseService],
})
export class UserModule {}
