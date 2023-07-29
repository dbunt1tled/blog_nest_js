import { Module } from '@nestjs/common';
import { MailController } from './mailController';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [MailController],
  providers: [AppService],
})
export class AppModule {}
