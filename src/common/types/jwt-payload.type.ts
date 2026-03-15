export interface JwtPayload {
  sub: number;
  username: string;
  email: string;
  role: string;
  type: string;
  iat?: number;
  exp?: number;
}
