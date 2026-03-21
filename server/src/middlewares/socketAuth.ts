import { Socket } from "socket.io";
import { AuthenticatedSocket } from "../types/request";
import { verifyAccessToken } from "../utils/jwt";

export async function socketAuth(socket: Socket, next: (err?: Error) => void) {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error("Authentication error"));
    }

    const payload = verifyAccessToken(token);

    (socket as AuthenticatedSocket).user = {
      id: payload.id,
      email: payload.email,
    };

    next();
  } catch (error) {
    next(new Error("Invalid token"));
  }
}
