import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { MainController } from './http/controllers/main';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ExceptionHandler } from './handler';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ORMModule } from './connectors/orm/o-r-m.module';
import { AccessGuard } from './auth/decorators';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailModule } from './connectors/mail/mail.module';
import { AcceptLanguageResolver, HeaderResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import * as path from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    ORMModule,
    MailModule,
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [
        new QueryResolver(["lang", "l"]),
        new HeaderResolver(["x-custom-lang"]),
        AcceptLanguageResolver,
      ],
    }),
  ],
  controllers: [MainController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: ExceptionHandler,
    },
    {
      provide: APP_GUARD,
      useClass: AccessGuard,
    },
  ],
})
export class AppModule {}
