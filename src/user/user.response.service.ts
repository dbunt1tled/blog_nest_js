import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './models/user';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { UserService } from './user.service';
import JSONAPISerializer from 'json-api-serializer';

@Injectable()
export class UserResponseService {
  constructor(
    private readonly i18n: I18nService,
    private readonly userService: UserService,
  ) {}

  response(user: User | User[], request?: object): object {
    const userSerializer: JSONAPISerializer = new JSONAPISerializer({
      convertCase: 'camelCase',
      unconvertCase: 'snake_case',
      convertCaseCacheSize: 100,
    });
    userSerializer.register('user', {
      id: 'id',
      blacklist: ['hashRt', 'hash'],
      topLevelMeta: function (data, extraData) {
        return {
          total: data.total,
          currentPage: extraData.currentPage,
          perPage: extraData.perPage,
          totalPages: extraData.totalPages,
        };
      },
      links: {
        self: function (data: User) {
          return '/users/' + data.id;
        },
      },
      jsonapiObject: false,
    });
    return userSerializer.serialize('user', user, {
      count: 1,
    });
  }
}
