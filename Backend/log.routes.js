import express from "express";
import { getLogs } from "../controllers/log.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getLogs);

export default router;
