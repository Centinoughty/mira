import { Router } from "express";
import { getUser, googleLogin, refreshToken } from "./auth.controller";
import { validate } from "../../middlewares/validate";
import { UserLoginBody } from "./auth.schema";
import { requireAuth } from "../../middlewares/auth";

const router = Router();

router.post("/google", validate(UserLoginBody), googleLogin);
router.get("/me", requireAuth, getUser);
router.post("/refresh", refreshToken);

export default router;
