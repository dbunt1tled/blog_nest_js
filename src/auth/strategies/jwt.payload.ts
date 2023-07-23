export type JwtPayload = {
  sub: number;
  email: string;
  session: string;
  iat: number;
  exp: number;
}