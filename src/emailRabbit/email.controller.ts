import { Controller, Get, Inject, Param, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable, map } from 'rxjs';
import { EmailService } from './email.service';

@Controller('emails-rabbit')
export class EmailController {
  constructor(
    private readonly emailService: EmailService,
  ) {}

  @Get('send/:email')
  async sendEmail(@Param('email') email: string): Promise<string> {
    const message = await this.emailService.sendEmail(email);
    console.log(message);
    return message;
  }

  @Get('send-event/:email')
  sendEmailEvent(@Param('email') email: string) {
    return this.emailService.sendEmailEvent(email);
  }
}
