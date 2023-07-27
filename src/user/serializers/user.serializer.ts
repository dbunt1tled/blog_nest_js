import { User } from '../models/user';

const userSerializer = {
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
  relationships: {},
  jsonapiObject: false,
};

export default userSerializer;
