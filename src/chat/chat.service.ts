import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';
import { ChatFilter } from '../chat/chat.filter';
import { Chat } from '../chat/models/chat';
import { ORMService } from '../connectors/orm/o-r-m.service';
import { Paginator } from '../connectors/requests/pagination/paginator';
import { Service } from '../connectors/service/service';
import { User } from '../user/models/user';
import { ChatCreate } from './dto/chat.create';

@Injectable()
export class ChatService extends Service {
  constructor(
    protected readonly i18n: I18nService,
    protected readonly ormService: ORMService,
    private readonly authService: AuthService,
  ) {
    super(i18n, ormService);
  }

  async create(chat: ChatCreate): Promise<Chat | null> {
    const ch = await (<Promise<Chat>>this.ormService.chat.create({
      data: {
        message: chat.message,
        authorId: chat.authorId,
      },
    }));
    if (ch) {
      ch.interface = 'Entity';
    }

    return ch;
  }

  async findById(id: number): Promise<Chat | null> {
    const chat = await (<Promise<Chat | null>>this.ormService.chat.findFirst({
      where: { id: id },
      take: 1,
    }));
    if (chat) {
      chat.interface = 'Entity';
    }

    return chat;
  }

  async getById(id: number): Promise<Chat> {
    const chat = await (<Promise<Chat>>this.ormService.chat
      .findUniqueOrThrow({
        where: { id: id },
      })
      .catch(() => {
        throw new NotFoundException(
          this.i18n.t('app.alert.chat_not_found', {
            lang: I18nContext.current().lang,
          }),
        );
      }));
    chat.interface = 'Entity';

    return chat;
  }

  async one(filter: ChatFilter) {
    const chat = await (<Promise<Chat | null>>(
      this.ormService.chat.findFirst(filter.build(1))
    ));
    if (chat) {
      chat.interface = 'Entity';
    }

    return chat;
  }

  async list(filter: ChatFilter): Promise<Chat[] | Paginator<Chat>> {
    const filterData = filter.build();
    const chats = <Chat[]>await this.ormService.chat.findMany(filter.build());
    chats.forEach((chat) => {
      chat.interface = 'Entity';
    });
    return await this.resultList(chats, filter);
  }

  async userFromSocket(socket: Socket): Promise<User> {
    try {
      let token: any = socket.handshake.headers.authorization;
      if (!token) {
        throw new ForbiddenException(this.i18n.t('app.alert.access_denied'));
      }
      token = token.split(' ');

      if (token.length !== 2) {
        throw new ForbiddenException(this.i18n.t('app.alert.access_denied'));
      }

      const user = await this.authService.userFromAuthenticationToken(token[1]);
      return user;
    } catch (e) {
      throw new WsException(e.message);
    }
  }
}
