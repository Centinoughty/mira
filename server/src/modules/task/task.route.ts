import { Router } from "express";
import { getTasks } from "./task.controller";
import { requireAuth } from "../../middlewares/auth";

const router = Router();

router.get("/", requireAuth, getTasks);
// router.post("/create");
// router.patch("/:id/status");
// router.patch("/:id");
// router.delete("/:id");

export default router;
