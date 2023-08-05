import { Entity } from '../../connectors/interfaces/entity';
import { Post } from '../../post/models/post';
import { Role } from '../enums/role';
import { UserStatus } from '../enums/user.status';

export interface User extends Entity {
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
  interface?: 'Entity';
}
