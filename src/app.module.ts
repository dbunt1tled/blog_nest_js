import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import * as path from 'path';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AccessGuard, RolesGuard } from './auth/decorators';
import { ChatModule } from './chat/chat.module';
import { MailModule } from './connectors/mail/mail.module';
import { ORMModule } from './connectors/orm/o-r-m.module';
import { PaginationQueryTransform } from './connectors/requests/pagination/pagination.query.transform';
import { Service } from './connectors/service/service';
import { EmailModule } from './email/email.module';
import { EmailModuleGRPC } from './emailGRPC/email.module';
import { EmailModuleRabbit } from './emailRabbit/email.module';
import { ExceptionHandler } from './handler';
import { UserModule } from './user/user.module';

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
        new QueryResolver(['lang', 'l']),
        new HeaderResolver(['x-custom-lang']),
        AcceptLanguageResolver,
      ],
    }),
    EmailModule,
    EmailModuleRabbit,
    EmailModuleGRPC,
    ChatModule,
  ],
  controllers: [],
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
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    PaginationQueryTransform,
    Service,
  ],
  exports: [PaginationQueryTransform, Service],
})
export class AppModule {}
