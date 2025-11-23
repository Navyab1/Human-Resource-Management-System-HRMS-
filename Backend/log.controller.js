import { LogEntry, User } from "../config/db.js";

export async function getLogs(req, res) {
  try {
    const limit = parseInt(req.query.limit || "100", 10);
    const logs = await LogEntry.findAll({
      where: { organisationId: req.user.organisationId },
      limit,
      order: [["createdAt", "DESC"]],
      include: [{ model: User, attributes: ["email"] }]
    });

    return res.json({ success: true, data: logs });
  } catch (err) {
    console.error("getLogs error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
