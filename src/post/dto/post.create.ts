import { PostStatus } from '../enum/post.status';

export interface PostCreate {
  title: string;
  img?: string;
  content?: string;
  status: PostStatus;
  authorId: number;
}
