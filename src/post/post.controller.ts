import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { I18nService } from 'nestjs-i18n';
import * as path from 'path';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';
import { CurrentUserId } from '../auth/decorators';
import { IncludeQuery } from '../connectors/requests';
import { Pagination } from '../connectors/requests/pagination/pagination';
import { PaginationQueryTransform } from '../connectors/requests/pagination/pagination.query.transform';
import { PFilter } from './dto';
import { PostCreate } from './dto/post.create';
import { PostUpdate } from './dto/post.update';
import { PostStatus } from './enum/post.status';
import { PostFilter } from './post.filter';
import { PostResponseService } from './post.response.service';
import { PostService } from './post.service';
import { PostCreateRequest } from './requests/post.create.request';
import { PostListQuery } from './requests/post.list.query';
import { PostUpdateRequest } from './requests/post.update.request';

@Controller('posts')
export class PostController {
  constructor(
    private readonly i18n: I18nService,
    private readonly postService: PostService,
    private readonly configService: ConfigService,
    private readonly postResponseService: PostResponseService,
  ) {}

  @Get('')
  async list(
    @Query() query: PostListQuery,
    @Query('', PaginationQueryTransform) pagination: Pagination,
    @Res() res: Response,
  ): Promise<void> {
    const posts = await this.postService.list(
      new PostFilter(<PFilter>query.filter, pagination),
    );
    res
      .status(HttpStatus.OK)
      .json(await this.postResponseService.response(posts, query))
      .send();
  }

  @Post('')
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Query() query,
    @Body() req: PostCreateRequest,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
    @CurrentUserId() userId: number,
  ) {
    let fileName: string | null = null;
    if (file) {
      const uploadPath = this.configService.get('POST_FILE_PATH');
      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath);
      }
      fileName = `${uuid()}${extname(file.originalname)}`;
      const ws = createWriteStream(path.join(uploadPath, fileName));
      ws.write(file.buffer);
    }
    console.log(req);
    const post = await this.postService.create(<PostCreate>{
      title: req.title,
      content: req.content,
      status: req.status,
      img: fileName,
      authorId: userId,
    });
    res
      .status(HttpStatus.CREATED)
      .json(await this.postResponseService.response(post, query))
      .send();
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id') id: number,
    @Query() query: IncludeQuery,
    @Body() req: PostUpdateRequest,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ): Promise<void> {
    let post = await this.postService.findById(id);
    if (!post || post.id !== req.id) {
      throw new NotFoundException(this.i18n.t('app.alert.user_not_found'));
    }
    let fileName: string | null = null;
    if (file) {
      fileName = `${uuid()}${extname(file.originalname)}`;
      const ws = createWriteStream(
        path.join(this.configService.get('POST_FILE_PATH'), fileName),
      );
      ws.write(file.buffer);
    }
    post = await this.postService.update(<PostUpdate>{
      ...req,
      ...{ img: fileName ? fileName : undefined },
    });
    res
      .status(HttpStatus.OK)
      .json(await this.postResponseService.response(post, query))
      .send();
  }

  @Delete(':id')
  async delete(
    @Param('id') id: number,
    @Query() query: IncludeQuery,
    @Res() res: Response,
  ): Promise<void> {
    const post = await this.postService.getById(id);
    await this.postService.update({
      id: post.id,
      status: PostStatus.DELETED,
    });
    res.status(HttpStatus.NO_CONTENT).send();
  }

  @Get(':id')
  async view(
    @Param('id') id: number,
    @Query() query: IncludeQuery,
    @Res() res: Response,
  ): Promise<void> {
    const post = await this.postService.getById(id);
    res
      .status(HttpStatus.OK)
      .json(await this.postResponseService.response(post, query))
      .send();
  }
}
