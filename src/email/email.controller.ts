import { Controller, Get, Inject, Param, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable, map } from 'rxjs';

@Controller('emails')
export class EmailController {
  constructor(
    @Inject('SUBSCRIBERS_SERVICE') private readonly service: ClientProxy,
  ) {}

  @Get('send/:email')
  sendEmail(@Param('email') email: string): Observable<string> {
    const message = this.service.send<string>(
      { cmd: 'send' },
      { email: email },
    );
    message.subscribe((result) => {
      console.log(result);
    });
    return message;
  }

  @Get('send-event/:email')
  sendEmailEvent(@Param('email') email: string) {
    return this.service.emit({ cmd: 'send-event' }, { email: email });
  }
}
