import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import * as path from 'path';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';

@Module({
  imports: [ConfigModule],
  controllers: [EmailController],
  providers: [
    {
      provide: 'EMAIL_PACKAGE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: 'email',
            protoPath: path.join(
              process.cwd(),
              'src/proto/email.proto',
            ),
            url: configService.get('GRPC_CONNECTION_URL'),
          },
        });
      },
      inject: [ConfigService],
    },
    EmailService,
  ],
})
export class EmailModuleGRPC {}
