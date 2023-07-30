import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc, ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, map } from 'rxjs';
import MailService from './interfaces/email.service';

@Injectable()
export class EmailService implements OnModuleInit {
  private service: MailService;

  constructor(@Inject('EMAIL_PACKAGE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.service = this.client.getService<MailService>('EmailService');
  }

  send(name: string, email: string) {
    return this.service.send({ name: name, email: email });
  }
}
