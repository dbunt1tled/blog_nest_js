import { CACHE_MANAGER, CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { Global, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { PostService } from '../post/post.service';
import { IsUniqueDatabase } from './decorators';
import { UserController } from './user.controller';
import { UserResponseService } from './user.response.service';
import { UserService } from './user.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        ttl: Number(configService.get<number>('CACHE_TTL')),
        max: Number(configService.get<number>('CACHE_MAX')),
        isGlobal: true,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [UserController],
  providers: [UserService, UserResponseService, IsUniqueDatabase, PostService],
  exports: [UserService, UserResponseService, PostService],
})
export class UserModule {}
