import { User } from '../models/user';

const userSerializer = {
  id: 'id',
  blacklist: ['hashRt', 'hash'],
  topLevelMeta: {},
  links: {
    self: function (data: User) {
      return `/users` + (data.id !== undefined ? `/${data.id}` : '');
    },
  },
  relationships: {},
  jsonapiObject: false,
};

export default userSerializer;
