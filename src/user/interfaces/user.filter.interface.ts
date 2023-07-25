import { UserStatus } from '../enums/user.status';
import { Role } from '../enums/role';

export interface UserFilterI {
  id?: number | number[];
  email?: string;
  name?: string;
  emailSearch?: string;
  nameSearch?: string;
  role?: Role | Role[];
  status?: UserStatus | UserStatus[];
}
