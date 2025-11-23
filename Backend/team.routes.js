import express from "express";
import {
  createTeam,
  getTeams,
  updateTeam,
  deleteTeam,
  assignEmployeesToTeam
} from "../controllers/team.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createTeam);
router.get("/", getTeams);
router.put("/:id", updateTeam);
router.delete("/:id", deleteTeam);
router.post("/:id/assign", assignEmployeesToTeam);

export default router;
