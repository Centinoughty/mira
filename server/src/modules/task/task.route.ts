import { Router } from "express";
import { createTask, getTasks } from "./task.controller";
import { requireAuth } from "../../middlewares/auth";
import { validate } from "../../middlewares/validate";
import { TaskCreateBody } from "./task.schema";

const router = Router();

router.get("/", requireAuth, getTasks);
router.post("/create", validate(TaskCreateBody), createTask);
// router.patch("/:id/status");
// router.patch("/:id");
// router.delete("/:id");

export default router;
