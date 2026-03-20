import { Router } from "express";
import { createTask, getTasks, toggleTaskStatus } from "./task.controller";
import { requireAuth } from "../../middlewares/auth";
import { validate } from "../../middlewares/validate";
import { TaskCreateBody, ToggleTaskParams } from "./task.schema";

const router = Router();

router.get("/", requireAuth, getTasks);

router.post("/create", requireAuth, validate(TaskCreateBody), createTask);

router.patch(
  "/:id/status",
  requireAuth,
  validate(ToggleTaskParams),
  toggleTaskStatus,
);

// router.patch("/:id");
// router.delete("/:id");

export default router;
