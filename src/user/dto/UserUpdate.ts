import { UserStatus } from '../enums/user.status';

export interface UserUpdate {
  userId: number;
  name?: string;
  status?: UserStatus;
  email?: string;
  hash?: string;
  hashRt?: string;
  confirmedAt?: Date;
}