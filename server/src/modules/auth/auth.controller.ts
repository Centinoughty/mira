import { Response } from "express";
import { TypedRequest } from "../../types/request";
import { UserLoginBody } from "./auth.schema";
import { verifyGoogleToken } from "../../lib/google";
import { prisma } from "../../lib/prisma";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt";

const isProd = process.env.NODE_ENV === "production";

const accessCookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: (isProd ? "none" : "lax") as "none" | "lax",
  maxAge: 15 * 60 * 1000,
};

const refreshCookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: (isProd ? "none" : "lax") as "none" | "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export async function googleLogin(
  req: TypedRequest<{}, UserLoginBody, {}>,
  res: Response,
) {
  try {
    const { idToken } = req.body;

    const googleUser = await verifyGoogleToken(idToken);

    let user = await prisma.user.findUnique({
      where: {
        email: googleUser.email,
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: googleUser.name!,
          email: googleUser.email!,
          avatar: googleUser.picture,
        },
      });
    }

    const tokenPayload = { id: user.id, email: user.email };
    const accessToken = signAccessToken(tokenPayload);
    const refreshToken = signRefreshToken(tokenPayload);

    res.cookie("accessToken", accessToken, accessCookieOptions);
    res.cookie("refreshToken", refreshToken, refreshCookieOptions);

    return res.status(200).json({
      message: "Login success",
      user: {
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.log("USER_LOGIN_ERROR", error);
    return res.status(500).json("Internal Server Error");
  }
}

export async function getUser(req: TypedRequest, res: Response) {
  try {
    const { id: userId } = req.user!;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        email: true,
        avatar: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "Fetched user profile", user });
  } catch (error) {
    console.log("GET_USER_ERROR", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function refreshToken(req: TypedRequest, res: Response) {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({ message: "No refresh token" });
    }

    const payload = verifyRefreshToken(token);
    const newAccessToken = signAccessToken({
      id: payload.id,
      email: payload.email,
    });

    res.cookie("accessToken", newAccessToken, accessCookieOptions);

    return res.status(200).json({ message: "Token refreshed" });
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Invalid or expired refresh token" });
  }
}
