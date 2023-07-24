import { UserStatus } from '../enums/user.status';

export interface UserFilterI {
  id?: number | number[];
  email?: string;
  name?: string;
  emailSearch?: string;
  nameSearch?: string;
}
