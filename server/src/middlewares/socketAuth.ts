import { Socket } from "socket.io";
import { AuthenticatedSocket } from "../types/request";
import { verifyAccessToken } from "../utils/jwt";

export function socketAuth(socket: Socket, next: (err?: Error) => void) {
  try {
    let token: string | undefined = socket.handshake.auth?.token;

    if (!token) {
      const cookieHeader = socket.handshake.headers.cookie ?? "";
      const match = cookieHeader
        .split(";")
        .map((c) => c.trim())
        .find((c) => c.startsWith("accessToken="));
      token = match?.split("=")[1];
    }

    if (!token) {
      return next(new Error("Authentication error: no token"));
    }

    const payload = verifyAccessToken(token);
    (socket as AuthenticatedSocket).user = {
      id: payload.id,
      email: payload.email,
    };

    next();
  } catch {
    next(new Error("Authentication error: invalid token"));
  }
}
