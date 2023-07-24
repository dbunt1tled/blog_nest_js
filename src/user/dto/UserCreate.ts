import { UserStatus } from '../enums/user.status';

export interface UserCreate {
  name: string;
  email: string;
  status: UserStatus;
  hash: string;
  hashRt?: string;
  confirmedAt?: Date;
}
