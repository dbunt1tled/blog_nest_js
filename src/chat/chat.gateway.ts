import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PostFilter } from '../post/post.filter';
import { ChatFilter } from './chat.filter';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  async handleConnection(socket: Socket) {
    await this.chatService.userFromSocket(socket);
  }

  @SubscribeMessage('send_message')
  async listenForMessages(
    @MessageBody() content: string,
    @ConnectedSocket() socket: Socket,
  ) {
    const author = await this.chatService.userFromSocket(socket);
    await this.chatService.create({ authorId: author.id, message: content });
    this.server.sockets.emit('receive_message', { content, author });
  }

  @SubscribeMessage('get_all_messages')
  async getAllMessages(@ConnectedSocket() socket: Socket) {
    await this.chatService.userFromSocket(socket);
    const messages = await this.chatService.list(
      new ChatFilter(
        {},
        {
          limit: 10,
          field: [{ id: 'desc' }],
        },
      ),
    );
    this.server.sockets.emit('receive_message', messages);
    return messages;
  }

  afterInit(server: Server) {
    console.log(server);
  }

  handleDisconnect(client: Socket) {
    console.log(`Disconnected: ${client.id}`);
  }
}
