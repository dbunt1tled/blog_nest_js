import { PostStatus } from '../enum/post.status';

export interface PFilter {
  id?: number | number[];
  authorId?: number|number[],
  titleSearch?: string;
  status?: PostStatus | PostStatus[];
}
