import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, map } from 'rxjs';

@Injectable()
export class EmailService {
  constructor(
    @Inject('EMAILS_SERVICE_RABBIT') private readonly service: ClientProxy,
  ) {}

  sendEmail(email: string) {
    const message = this.service
      .send<string>({ cmd: 'send' }, { email: email })
      .pipe(map((response: string) => response));
    return lastValueFrom(message);
  }

  sendEmailEvent(email: string) {
    return this.service.emit<string>({ cmd: 'send-event' }, { email: email });
  }
}
