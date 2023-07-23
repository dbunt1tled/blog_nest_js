import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { MainController } from './http/controllers/main';
import { APP_FILTER } from '@nestjs/core';
import { ExceptionHandler } from './http/handler';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ORMModule } from './connectors/o-r-m.module';

@Module({
  imports: [AuthModule, UserModule, ORMModule],
  controllers: [MainController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: ExceptionHandler,
    },
  ],
})
export class AppModule {}
