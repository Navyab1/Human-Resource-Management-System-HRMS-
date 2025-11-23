import express from "express";
import { registerOrganisation, login, logout } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register-org", registerOrganisation);
router.post("/login", login);
router.post("/logout", authMiddleware, logout);

export default router;
