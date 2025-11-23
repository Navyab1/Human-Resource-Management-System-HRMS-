import { LogEntry } from "../config/db.js";

export async function logAction({ userId, organisationId, action, details }) {
  try {
    await LogEntry.create({
      userId,
      organisationId,
      action,
      details
    });
  } catch (err) {
    console.error("Failed to log action:", err.message);
  }
}
