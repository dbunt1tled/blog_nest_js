import { Controller, Get, HttpCode, HttpStatus, Param, Query, Req, Res, ValidationPipe } from '@nestjs/common';
import { Request, Response} from 'express';
import { PostListRequest } from '../requests/post-list';

@Controller()
export class MainController {
  @Get('list')
  @HttpCode(200)
  list(@Query() query: PostListRequest, @Res() res: Response) {
    res
      .status(HttpStatus.OK)
      .json({
        name: query.name,
        limit: query.limit,
      })
      .send();
  }

  @Get(':id')
  byId(@Param() id: number) {
    return id;
  }
}
