import { Router } from "express";
import {
  addTeamMember,
  createTeam,
  deleteTeam,
  getTeams,
  removeTeamMember,
} from "./team.controller";
import { requireAuth } from "../../middlewares/auth";
import { validate } from "../../middlewares/validate";
import {
  AddTeamMemberBody,
  CreateTeamBody,
  TeamIdParams,
  TeamMemberParams,
} from "./team.schema";

const router = Router();

router.get("/", requireAuth, getTeams);
router.post("/", requireAuth, validate(CreateTeamBody), createTeam);
router.post(
  "/:id/members",
  requireAuth,
  validate(TeamIdParams, "params"),
  validate(AddTeamMemberBody),
  addTeamMember,
);
router.delete(
  "/:id/members/:memberId",
  requireAuth,
  validate(TeamMemberParams, "params"),
  removeTeamMember,
);
router.delete(
  "/:id",
  requireAuth,
  validate(TeamIdParams, "params"),
  deleteTeam,
);

export default router;
