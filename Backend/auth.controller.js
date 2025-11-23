import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Organisation, User } from "../config/db.js";
import { JWT_SECRET } from "../config/env.js";
import { logAction } from "../utils/logger.js";

export async function registerOrganisation(req, res) {
  try {
    const { organisationName, adminEmail, password } = req.body;
    if (!organisationName || !adminEmail || !password) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const existingUser = await User.findOne({ where: { email: adminEmail } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    const org = await Organisation.create({ name: organisationName });
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      email: adminEmail,
      passwordHash,
      organisationId: org.id
    });

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "8h" });

    await logAction({
      userId: user.id,
      organisationId: org.id,
      action: "ORG_REGISTER",
      details: `User '${user.email}' created organisation '${org.name}'.`
    });

    return res.json({
      success: true,
      data: {
        token,
        user: { id: user.id, email: user.email, organisationId: user.organisationId },
        organisation: org
      }
    });
  } catch (err) {
    console.error("registerOrganisation error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Missing email or password" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "8h" });

    await logAction({
      userId: user.id,
      organisationId: user.organisationId,
      action: "LOGIN",
      details: `User '${user.email}' logged in.`
    });

    return res.json({
      success: true,
      data: {
        token,
        user: { id: user.id, email: user.email, organisationId: user.organisationId }
      }
    });
  } catch (err) {
    console.error("login error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

export async function logout(req, res) {
  try {
    if (req.user) {
      await logAction({
        userId: req.user.id,
        organisationId: req.user.organisationId,
        action: "LOGOUT",
        details: `User '${req.user.email}' logged out.`
      });
    }
    return res.json({ success: true, message: "Logged out (client must discard token)." });
  } catch (err) {
    console.error("logout error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
