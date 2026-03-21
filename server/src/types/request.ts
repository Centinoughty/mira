import { Request } from "express";
import { Socket } from "socket.io";

export interface AuthUser {
  id: string;
  email: string;
}

interface AuthenticatedRequest {
  user?: AuthUser;
}

export interface AuthenticatedSocket extends Socket {
  user: AuthUser;
}

export type TypedRequest<
  P = unknown,
  B = unknown,
  Q = unknown,
> = AuthenticatedRequest & Request<P, any, B, Q>;
