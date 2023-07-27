import { UserStatus } from '../enums/user.status';
import { Role } from '../enums/role';
import { Post } from '../../post/models/post';

export interface User {
  id?: number;
  status: UserStatus;
  email: string;
  name?: string;
  role: Role;
  hash: string;
  hashRt?: string;
  confirmedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  post?: Post[];
}