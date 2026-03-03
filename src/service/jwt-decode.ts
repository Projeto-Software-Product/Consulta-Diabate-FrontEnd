import { jwtDecode, type JwtPayload } from "jwt-decode";

export function decodeJwt<T extends JwtPayload = JwtPayload>(token: string): T {
  try {
    const payload = jwtDecode<T>(token);

    const now = Math.floor(Date.now() / 1000);
    if (
      typeof (payload as JwtPayload).exp === "number" &&
      (payload as JwtPayload).exp! < now
    ) {
      throw new Error("Token expirado");
    }

    return payload;
  } catch (e) {
    throw new Error("Token inválido ou expirado");
  }
}
