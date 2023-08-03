import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { PostController } from './post.controller';
import { PostResponseService } from './post.response.service';
import { PostService } from './post.service';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Global()
@Module({
  controllers: [PostController],
  providers: [PostService, PostResponseService, ConfigService],
  exports: [PostService, PostResponseService, ConfigService],
})
export class PostModule {}
