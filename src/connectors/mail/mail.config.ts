import { ConfigService } from '@nestjs/config';
import { I18nService } from 'nestjs-i18n';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

export const getMailConfig = async (
  configService: ConfigService,
  i18n: I18nService,
): Promise<any> => {
  const transport = configService.get<string>('MAIL_TRANSPORT');
  const mailFromName = configService.get<string>('MAIL_FROM_NAME');
  const mailFromAddress = transport.split(':')[1].split('//')[1];

  return {
    transport,
    defaults: {
      from: `"${mailFromName}" <${mailFromAddress}>`,
    },
    template: {
      adapter: new HandlebarsAdapter({ t: i18n.hbsHelper }),
      options: {
        strict: false,
      },
    },
  };
};
