import { UserStatus } from '../enums/user.status';
import { Role } from '../enums/role';

export interface UserCreate {
  name: string;
  email: string;
  status: UserStatus;
  role: Role;
  hash: string;
  hashRt?: string;
  confirmedAt?: Date;
}
