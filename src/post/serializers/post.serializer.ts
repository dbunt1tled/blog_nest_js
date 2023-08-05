import { Post } from '../models/post';
import {isPaginator} from '../../connectors/helpers/helper';

const postSerializer = {
  id: 'id',
  topLevelMeta: {},
  links: {
    self: function (data: Post) {
      return '/posts/' + data.id;
    },
  },
  relationships: {},
  jsonapiObject: false,
};

export default postSerializer;
