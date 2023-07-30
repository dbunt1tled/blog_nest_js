import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';

@Module({
  imports: [ConfigModule],
  controllers: [EmailController],
  providers: [
    {
      provide: 'EMAILS_SERVICE',
      useFactory: (configService: ConfigService) =>
        ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: configService.get('EMAIL_SERVICE_HOST'),
            port: configService.get('EMAIL_SERVICE_PORT'),
          },
        }),
      inject: [ConfigService],
    },
    EmailService,
  ],
})
export class EmailModule {}
