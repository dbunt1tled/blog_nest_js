import { User } from '../models/user';
import { Paginator } from '../../connectors/requests/pagination/paginator';

const userSerializer = {
  id: 'id',
  blacklist: ['hashRt', 'hash'],
  topLevelMeta: function (data) {
    if ('data' in data) {
      const paginator = <Paginator<User>>data.data;
      return {
        total: paginator.total,
        currentPage: paginator.page,
        perPage: paginator.perPage,
        totalPages: paginator.totalPage,
      };
    }
    return {};
  },
  links: {
    self: function (data: User) {
      return `/users` + (data.id !== undefined ? `/${data.id}` : '');
    },
  },
  relationships: {},
  jsonapiObject: false,
};

export default userSerializer;
