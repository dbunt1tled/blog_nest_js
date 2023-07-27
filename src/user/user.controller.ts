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
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { MailService } from '../connectors/mail/mail.service';
import { UserCreateRequest } from './requests/user.create.request';
import { UserCreate } from './dto/user.create';
import * as argon2 from 'argon2';
import { UserUpdateRequest } from './requests/user.update.request';
import { UserUpdate } from './dto/user.update';
import { UserStatus } from './enums/user.status';
import { UFilter } from './dto/user.filter';
import { UserListRequest } from './requests/user.list.request';
import { UserFilter } from './user.filter';
import userSerializer from './serializers/user.serializer';
import { UserResponseService } from './user.response.service';

@Controller('users')
export class UserController {
  constructor(
    private readonly i18n: I18nService,
    private readonly userService: UserService,
    private readonly mailService: MailService,
    private readonly userResponseService: UserResponseService,
  ) {}

  @Get('')
  async list(@Query() query: UserListRequest, @Res() res: Response) {
    const users = await this.userService.list(new UserFilter(<UFilter>query));
    res
      .status(HttpStatus.OK)
      .json(this.userResponseService.response(users, query))
      .send();
  }

  @Post('')
  async create(@Body() req: UserCreateRequest, @Res() res: Response) {
    const user = await this.userService.create(<UserCreate>{
      ...req,
      ...{ hash: await argon2.hash(req.password) },
    });
    res
      .status(HttpStatus.CREATED)
      .json(userSerializer.serialize('user', user))
      .send();
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() req: UserUpdateRequest,
    @Res() res: Response,
  ) {
    let user = await this.userService.findById(id);
    if (!user || user.id !== req.id) {
      throw new NotFoundException(
        this.i18n.t('app.alert.user_not_found', {
          lang: I18nContext.current().lang,
        }),
      );
    }
    user = await this.userService.update(<UserUpdate>{
      ...req,
      ...{ hash: req.password ? await argon2.hash(req.password) : undefined },
    });
    res
      .status(HttpStatus.OK)
      .json(userSerializer.serialize('user', user))
      .send();
  }

  @Delete(':id')
  async delete(@Param('id') id: number, @Res() res: Response) {
    const user = await this.userService.getById(id);
    await this.userService.update({
      id: user.id,
      status: UserStatus.DELETED,
    });
    res.status(HttpStatus.NO_CONTENT).json().send();
  }

  @Get(':id')
  async view(@Param('id') id: number, @Res() res: Response) {
    const user = await this.userService.getById(id);
    res
      .status(HttpStatus.OK)
      .json(userSerializer.serialize('user', user))
      .send();
  }
}
