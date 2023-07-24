import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { UserService } from '../../user/user.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async sendConfirmationEmail(userId: number) {
    const urlConfirmAddress = this.configService.get<string>(
      'URL_CONFIRM_ADDRESS',
    );
    const user = await this.userService.getById(userId);
    console.log(String.prototype.concat(__dirname, '/../templates/', 'confirmUserEmail'));
    return await this.mailerService.sendMail({
      to: user.email,
      subject: 'Confirmation Email',
      template: String.prototype.concat(__dirname, '/../../templates/', 'confirmUserEmail'),
      context: {
        id: user.id,
        username: user.name,
        urlConfirmAddress,
      },
    });
  }
}
