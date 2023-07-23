export interface UserCreate {
  name: string;
  email: string;
  hash: string;
  hashRt?: string;
}