import jwt, { Secret, SignOptions } from "jsonwebtoken";

const ACCESS_SECRET: Secret = process.env.ACCESS_SECRET as Secret;
const ACCESS_EXPIRY: SignOptions["expiresIn"] =
  (process.env.ACCESS_EXPIRY as SignOptions["expiresIn"]) || "1m";

const REFRESH_SECRET: Secret = process.env.REFRESH_SECRET as Secret;
const REFRESH_EXPIRY: SignOptions["expiresIn"] =
  (process.env.REFRESH_EXPIRY as SignOptions["expiresIn"]) || "7d";

export function signAccessToken(userId: string) {
  const accessToken = jwt.sign({ userId }, ACCESS_SECRET, {
    expiresIn: ACCESS_EXPIRY,
  });

  return accessToken;
}

export function signRefreshToken(userId: string) {
  const refreshToken = jwt.sign({ userId }, REFRESH_SECRET, {
    expiresIn: REFRESH_EXPIRY,
  });

  return refreshToken;
}
