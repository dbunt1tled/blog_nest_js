import { UserStatus } from '../enums/user.status';
import { Role } from '../enums/role';

export interface UserUpdate {
  id: number;
  name?: string;
  status?: UserStatus;
  role?: Role;
  email?: string;
  hash?: string;
  hashRt?: string;
  confirmedAt?: Date;
}