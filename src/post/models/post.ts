import { PostStatus } from '../enum/post.status';
import { User } from '../../user/models/user';

export interface Post {
  id?: number;
  title: string;
  status: PostStatus;
  content: string;
  authorId: number;
  createdAt: Date;
  updatedAt: Date;
  author?: User;
}
