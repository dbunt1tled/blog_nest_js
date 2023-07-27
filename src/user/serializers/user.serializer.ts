import JSONAPISerializer from 'json-api-serializer';
import { User } from '../models/user';

const userSerializer = new JSONAPISerializer({
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

export default userSerializer;
