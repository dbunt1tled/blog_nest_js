import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { UserService } from '../../user/user.service';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../../auth/auth.service';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly i18nService: I18nService,
  ) {}

  async sendConfirmationEmail(userId: number, token: string) {
    const urlConfirmAddress = this.configService.get<string>(
      'URL_CONFIRM_ADDRESS',
    );
    const user = await this.userService.getById(userId);
    return await this.mailerService.sendMail({
      to: user.email,
      subject: this.i18nService.t('app.mail.confirmation_email', {
        lang: I18nContext.current().lang,
      }),
      template: String.prototype.concat(__dirname, '/../../templates/', 'confirmUserEmail'),
      context: {
        id: user.id,
        helloArgs: { username: user.name },
        urlConfirmAddress: String.prototype.concat(
          urlConfirmAddress,
          '/',
          token,
        ),
      },
    });
  }
}
