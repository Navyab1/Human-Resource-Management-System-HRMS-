import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";
import { User, Organisation } from "../config/db.js";

export async function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ success: false, message: "Invalid token format" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(decoded.id, { include: Organisation });
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }
    req.user = {
      id: user.id,
      email: user.email,
      organisationId: user.organisationId,
      organisation: user.Organisation
    };
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
}
