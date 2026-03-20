import { Router } from "express";
import {
  createTask,
  deleteTask,
  getTasks,
  toggleTaskStatus,
  updateTask,
} from "./task.controller";
import { requireAuth } from "../../middlewares/auth";
import { validate } from "../../middlewares/validate";
import { TaskCreateBody, TaskIdParams, TaskUpdateBody } from "./task.schema";

const router = Router();

router.get("/", requireAuth, getTasks);

router.post("/create", requireAuth, validate(TaskCreateBody), createTask);

router.patch(
  "/:id/status",
  requireAuth,
  validate(TaskIdParams, "params"),
  toggleTaskStatus,
);

router.patch(
  "/:id",
  requireAuth,
  validate(TaskIdParams, "params"),
  validate(TaskUpdateBody),
  updateTask,
);

router.delete(
  "/:id",
  requireAuth,
  validate(TaskIdParams, "params"),
  deleteTask,
);

export default router;
