import { Post } from '../models/post';

const postSerializer = {
  id: 'id',
  topLevelMeta: function (data, extraData) {
    return {
      total: data.total,
      currentPage: extraData.currentPage,
      perPage: extraData.perPage,
      totalPages: extraData.totalPages,
    };
  },
  links: {
    self: function (data: Post) {
      return '/posts/' + data.id;
    },
  },
  relationships: {},
  jsonapiObject: false,
};

export default postSerializer;
