import { PostStatus } from '../enum/post.status';

export interface PostUpdate {
  id: number;
  title?: string;
  img?: string;
  content?: string;
  status?: PostStatus;
  authorId?: number;
}