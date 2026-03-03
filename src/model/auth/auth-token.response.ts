export interface AuthTokenResponse {
  iss: string;
  sub: string;
  iat: number;
  exp: number;
  id: string;
}
