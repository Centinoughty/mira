import { Request } from "express";

export interface AuthUser {
  id: string;
  email: string;
}

interface AuthenticatedRequest {
  user?: AuthUser;
}

export type TypedRequest<
  P = unknown,
  B = unknown,
  Q = unknown,
> = AuthenticatedRequest & Request<P, any, B, Q>;
