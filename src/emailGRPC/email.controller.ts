import { Controller, Get, Inject, Param, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable, map } from 'rxjs';
import { EmailService } from './email.service';
import { Metadata } from '@grpc/grpc-js';

@Controller('emails-grpc')
export class EmailController {
  constructor(
    private readonly emailService: EmailService,
  ) {}

  @Get('send/:email')
  call(@Param('email') email: string) {
    const metadata = new Metadata();
    metadata.add('Set-Cookie', 'yummy_cookie=choco');
    const message = this.emailService.send('Petya', email);
    console.log(message);
    return message;
  }



  // async sendEmail(@Param('email') email: string) {
  //   const message = await this.emailService.send('Petya', email);
  //   console.log(message);
  //   return message;
  // }
}
