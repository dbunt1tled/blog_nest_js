import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { diskStorage } from 'multer';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import * as path from 'path';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';
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
import { HealthModule } from './health/health.module';
import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'storage', 'public'),
      renderPath: '/storage/public',
      serveRoot: '/public/',
    }),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        storage: diskStorage({
          destination: configService.get<string>('MULTER_DEST'),
          filename: (req, file, cb) => {
            return cb(null, `${uuid()}${extname(file.originalname)}`);
          },
        }),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    PostModule,
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
    HealthModule,
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
