import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';

@Module({
  providers: [ChatService, ChatGateway, ConfigService, AuthService, JwtService],
  exports: [ChatService],
})
export class ChatModule {}
