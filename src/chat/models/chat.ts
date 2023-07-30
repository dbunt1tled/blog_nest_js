import { User } from '../../user/models/user';

export interface Chat {
  id?: number;
  message: string;
  authorId: number;
  createdAt: Date;
  updatedAt: Date;
  author?: User;
  interface?: 'Entity';
}
