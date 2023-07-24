import { UserStatus } from '../enums/user.status';

export interface UserI {
  id?: number;
  status: UserStatus;
  email: string;
  name?: string;
  hash: string;
  hashRt?: string;
  confirmedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
