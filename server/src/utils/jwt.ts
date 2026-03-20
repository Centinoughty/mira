import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { AuthUser } from "../types/request";

const ACCESS_SECRET: Secret = process.env.ACCESS_SECRET as Secret;
const ACCESS_EXPIRY: SignOptions["expiresIn"] =
  (process.env.ACCESS_EXPIRY as SignOptions["expiresIn"]) || "1m";

const REFRESH_SECRET: Secret = process.env.REFRESH_SECRET as Secret;
const REFRESH_EXPIRY: SignOptions["expiresIn"] =
  (process.env.REFRESH_EXPIRY as SignOptions["expiresIn"]) || "7d";

export function signAccessToken(payload: AuthUser) {
  const accessToken = jwt.sign(payload, ACCESS_SECRET, {
    expiresIn: ACCESS_EXPIRY,
  });

  return accessToken;
}

export function signRefreshToken(payload: AuthUser) {
  const refreshToken = jwt.sign(payload, REFRESH_SECRET, {
    expiresIn: REFRESH_EXPIRY,
  });

  return refreshToken;
}

export function verifyAccessToken(token: string): AuthUser {
  return jwt.verify(token, ACCESS_SECRET) as AuthUser;
}

export function verifyRefreshToken(token: string): AuthUser {
  return jwt.verify(token, REFRESH_SECRET) as AuthUser;
}
