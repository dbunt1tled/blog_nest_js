import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller('mails')
export class MailController {
  constructor(private readonly appService: AppService) {}

  @GrpcMethod('EmailService', 'send')
  send(
    email: { email: string; name: string },
    metadata: Metadata,
    call: ServerUnaryCall<any, any>,
  ) {
    console.log(email);
    return { id: 1, name: email.email, email: email.name };
  }
}
