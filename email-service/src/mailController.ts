import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller('mails')
export class MailController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'send' })
  send(): string {
    console.log('boroda');
    return this.appService.getHello();
  }
}
