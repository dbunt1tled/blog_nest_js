import { TokenType } from './token.type';

export type JwtPayload = {
  sub: number;
  email: string;
  session: string;
  type: TokenType;
  iat: number;
  exp: number;
}