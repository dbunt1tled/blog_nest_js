import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { MailService } from '../connectors/mail/mail.service';
import { UserCreateRequest } from './requests/user.create.request';
import { UserCreate } from './dto/user.create';
import * as argon2 from 'argon2';

@Controller('users')
export class UserController {
  constructor(
    private readonly i18n: I18nService,
    private readonly userService: UserService,
    private readonly mailService: MailService,
  ) {}
  @Post('')
  async create(@Body() req: UserCreateRequest, @Res() res: Response) {
    const user = await this.userService.create(<UserCreate>{
      ...req,
      ...{ hash: await argon2.hash(req.password) },
    });
    res.status(HttpStatus.OK).json(user).send();
  }
}
