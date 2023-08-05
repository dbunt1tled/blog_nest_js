import { Entity } from '../../connectors/interfaces/entity';
import { User } from '../../user/models/user';
import { PostStatus } from '../enum/post.status';

export interface Post extends Entity {
  id?: number;
  title: string;
  status: PostStatus;
  content: string;
  authorId: number;
  createdAt: Date;
  updatedAt: Date;
  author?: User;
  interface?: 'Entity';
}
