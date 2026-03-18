import { Router } from "express";
import { googleLogin } from "./auth.controller";
import { validate } from "../../middlewares/validate";
import { UserLoginBody } from "./auth.schema";

const router = Router();

router.post("/google", validate(UserLoginBody), googleLogin);

export default router;
