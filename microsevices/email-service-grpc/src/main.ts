import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  await app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'email',
      protoPath: path.join(process.cwd(), 'src/proto/email.proto'),
      url: configService.get('GRPC_CONNECTION_URL'),
    },
  });

  await app.startAllMicroservices();
}

bootstrap();
