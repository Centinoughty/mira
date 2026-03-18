import { Response } from "express";
import { TypedRequest } from "../../types/request";
import { UserLoginBody } from "./auth.schema";
import { verifyGoogleToken } from "../../lib/google";
import { prisma } from "../../lib/prisma";
import { signAccessToken, signRefreshToken } from "../../utils/jwt";

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

    const accessToken = signAccessToken(user.id);
    const refreshToken = signRefreshToken(user.id);

    return res.status(200).json({
      message: "Login success",
      accessToken,
      refreshToken,
      user: { email: user.email, name: user.name, avatar: user.avatar },
    });
  } catch (error) {
    console.log("USER_LOGIN_ERROR", error);
    res.status(500).json("Internal Server Error");
  }
}
