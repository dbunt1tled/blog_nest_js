import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern, MessagePattern } from '@nestjs/microservices';

@Controller('mails')
export class MailController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'send' })
  send(email: string): string {
    console.log(email);
    return this.appService.getHello();
  }
  @EventPattern({ cmd: 'send-event' })
  sendEvent(email: string): string {
    console.log(email);
    return this.appService.getHello();
  }
}
