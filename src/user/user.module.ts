import { Global, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { IsUniqueDatabase } from './decorators';

@Global()
@Module({
  controllers: [UserController],
  providers: [UserService, IsUniqueDatabase],
  exports: [UserService],
})
export class UserModule {}
