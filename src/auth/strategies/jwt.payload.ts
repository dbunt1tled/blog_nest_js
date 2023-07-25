import { TokenType } from './token.type';
import { Role } from '../../user/enums/role';

export type JwtPayload = {
  sub: number;
  email: string;
  session: string;
  role: Role[],
  type: TokenType;
  iat: number;
  exp: number;
}