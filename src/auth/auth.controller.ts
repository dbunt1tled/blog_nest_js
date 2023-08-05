import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Auth } from './dto/auth';
import { SignUp } from './dto/sign-up';
import { Response } from 'express';
import { Tokens } from './dto/tokens';
import {
  AccessGuard,
  CurrentUserId,
  Public,
  RefreshGuard,
} from './decorators';
import { UserService } from '../user/user.service';
import { UserStatus } from '../user/enums/user.status';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { MailService } from '../connectors/mail/mail.service';
import { EmailConfirmResend } from './dto/emailConfirmResend';
import { UserFilter } from '../user/user.filter';
import { Role } from '../user/enums/role';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly i18n: I18nService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly mailService: MailService,
  ) {}
  @Post('signup')
  @Public()
  async signup(@Body() auth: SignUp, @Res() res: Response) {
    const user = await this.authService.signup(auth);
    const token = await this.authService.confirmToken(user.id);
    await this.mailService.sendConfirmationEmail(user.id, token);
    res.status(HttpStatus.OK).json().send();
  }
  @Post('login')
  @Public()
  async login(@Body() auth: Auth, @Res() res: Response) {
    const tokens: Tokens = await this.authService.login(auth);
    res.status(HttpStatus.OK).json(tokens).send();
  }

  @Post('logout')
  @UseGuards(AccessGuard)
  async logout(@CurrentUserId() userId: number, @Res() res: Response) {
    await this.authService.logout(userId);
    res.status(HttpStatus.OK).json().send();
  }

  @Post('refresh')
  @Public()
  @UseGuards(RefreshGuard)
  async refresh(@CurrentUserId() userId: number, @Res() res: Response) {
    const tokens: Tokens = await this.authService.refresh(userId);
    res.status(HttpStatus.OK).json(tokens).send();
  }

  @Get('confirm-email/:token')
  @Public()
  async confirmEmail(@Param('token') token: string, @Res() res: Response) {
    const jwtPayload = this.authService.decodeToken(token);
    const user = await this.userService.findById(jwtPayload.sub);
    if (
      !user ||
      user.hashRt !== jwtPayload.session ||
      user.status !== UserStatus.PENDING
    ) {
      throw new UnprocessableEntityException(
        this.i18n.t('app.alert.confirmation_alert', {
          lang: I18nContext.current().lang,
        }),
      );
    }
    await this.userService.update({
      id: user.id,
      status: UserStatus.ACTIVE,
      confirmedAt: new Date(),
      hashRt: null,
    });
    res.status(HttpStatus.OK).json().send();
  }

  @Post('confirm-email-resend')
  @Public()
  async confirmEmailResend(
    @Body() email: EmailConfirmResend,
    @Res() res: Response,
  ) {
    const user = await this.userService.one(
      new UserFilter({ email: email.email }),
    );
    if (!user) {
      throw new UnprocessableEntityException(
        this.i18n.t('app.alert.user_email_not_exists', {
          args: { email: email.email },
          lang: I18nContext.current().lang,
        }),
      );
    }
    if (user.status !== UserStatus.PENDING) {
      throw new UnprocessableEntityException(
        this.i18n.t('app.alert.user_email_confirmed', {
          args: { email: email.email },
          lang: I18nContext.current().lang,
        }),
      );
    }
    const token = await this.authService.confirmToken(user.id);
    await this.mailService.sendConfirmationEmail(user.id, token);
    res.status(HttpStatus.OK).json().send();
  }
}
