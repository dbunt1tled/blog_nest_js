import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';

@Controller('mails')
export class MailController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'send' })
  send(@Payload() email: string, @Ctx() context: RmqContext): string {
    console.log(email);
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    channel.ack(originalMsg);
    return this.appService.getHello();
  }
  @EventPattern({ cmd: 'send-event' })
  sendEvent(@Payload() email: string, @Ctx() context: RmqContext): string {
    console.log(email);
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    channel.ack(originalMsg);
    return this.appService.getHello();
  }
}
