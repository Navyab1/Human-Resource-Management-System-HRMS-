import { Team, Employee } from "../config/db.js";
import { logAction } from "../utils/logger.js";

export async function createTeam(req, res) {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: "Name is required" });
    }

    const team = await Team.create({
      name,
      description: description || "",
      organisationId: req.user.organisationId
    });

    await logAction({
      userId: req.user.id,
      organisationId: req.user.organisationId,
      action: "TEAM_CREATE",
      details: `User '${req.user.email}' created team with ID ${team.id}.`
    });

    return res.json({ success: true, data: team });
  } catch (err) {
    console.error("createTeam error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

export async function getTeams(req, res) {
  try {
    const teams = await Team.findAll({
      where: { organisationId: req.user.organisationId },
      include: [{ model: Employee }]
    });
    return res.json({ success: true, data: teams });
  } catch (err) {
    console.error("getTeams error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

export async function updateTeam(req, res) {
  try {
    const id = req.params.id;
    const { name, description } = req.body;

    const team = await Team.findOne({
      where: { id, organisationId: req.user.organisationId }
    });
    if (!team) {
      return res.status(404).json({ success: false, message: "Team not found" });
    }

    team.name = name ?? team.name;
    team.description = description ?? team.description;
    await team.save();

    await logAction({
      userId: req.user.id,
      organisationId: req.user.organisationId,
      action: "TEAM_UPDATE",
      details: `User '${req.user.email}' updated team ${team.id}.`
    });

    return res.json({ success: true, data: team });
  } catch (err) {
    console.error("updateTeam error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

export async function deleteTeam(req, res) {
  try {
    const id = req.params.id;
    const team = await Team.findOne({
      where: { id, organisationId: req.user.organisationId }
    });
    if (!team) {
      return res.status(404).json({ success: false, message: "Team not found" });
    }

    await team.destroy();

    await logAction({
      userId: req.user.id,
      organisationId: req.user.organisationId,
      action: "TEAM_DELETE",
      details: `User '${req.user.email}' deleted team ${id}.`
    });

    return res.json({ success: true, message: "Team deleted" });
  } catch (err) {
    console.error("deleteTeam error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

export async function assignEmployeesToTeam(req, res) {
  try {
    const teamId = req.params.id;
    const { employeeIds } = req.body;

    const team = await Team.findOne({
      where: { id: teamId, organisationId: req.user.organisationId }
    });
    if (!team) {
      return res.status(404).json({ success: false, message: "Team not found" });
    }

    const employees = await Employee.findAll({
      where: { id: employeeIds || [], organisationId: req.user.organisationId }
    });

    await team.setEmployees(employees);

    await logAction({
      userId: req.user.id,
      organisationId: req.user.organisationId,
      action: "TEAM_ASSIGN",
      details: `User '${req.user.email}' assigned employees [${employees.map(e => e.id).join(", ")}] to team ${team.id}.`
    });

    const updatedTeam = await Team.findOne({
      where: { id: teamId },
      include: [{ model: Employee }]
    });

    return res.json({ success: true, data: updatedTeam });
  } catch (err) {
    console.error("assignEmployeesToTeam error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
