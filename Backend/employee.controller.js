import { Employee, Team } from "../config/db.js";
import { logAction } from "../utils/logger.js";

export async function createEmployee(req, res) {
  try {
    const { name, email, position } = req.body;
    if (!name || !email) {
      return res.status(400).json({ success: false, message: "Name and email are required" });
    }

    const employee = await Employee.create({
      name,
      email,
      position: position || "",
      organisationId: req.user.organisationId
    });

    await logAction({
      userId: req.user.id,
      organisationId: req.user.organisationId,
      action: "EMPLOYEE_CREATE",
      details: `User '${req.user.email}' created employee with ID ${employee.id}.`
    });

    return res.json({ success: true, data: employee });
  } catch (err) {
    console.error("createEmployee error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

export async function getEmployees(req, res) {
  try {
    const employees = await Employee.findAll({
      where: { organisationId: req.user.organisationId },
      include: [{ model: Team }]
    });
    return res.json({ success: true, data: employees });
  } catch (err) {
    console.error("getEmployees error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

export async function getEmployeeById(req, res) {
  try {
    const id = req.params.id;
    const employee = await Employee.findOne({
      where: { id, organisationId: req.user.organisationId },
      include: [{ model: Team }]
    });
    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }
    return res.json({ success: true, data: employee });
  } catch (err) {
    console.error("getEmployeeById error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

export async function updateEmployee(req, res) {
  try {
    const id = req.params.id;
    const { name, email, position } = req.body;

    const employee = await Employee.findOne({
      where: { id, organisationId: req.user.organisationId }
    });
    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    employee.name = name ?? employee.name;
    employee.email = email ?? employee.email;
    employee.position = position ?? employee.position;
    await employee.save();

    await logAction({
      userId: req.user.id,
      organisationId: req.user.organisationId,
      action: "EMPLOYEE_UPDATE",
      details: `User '${req.user.email}' updated employee ${employee.id}.`
    });

    return res.json({ success: true, data: employee });
  } catch (err) {
    console.error("updateEmployee error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

export async function deleteEmployee(req, res) {
  try {
    const id = req.params.id;
    const employee = await Employee.findOne({
      where: { id, organisationId: req.user.organisationId }
    });
    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    await employee.destroy();

    await logAction({
      userId: req.user.id,
      organisationId: req.user.organisationId,
      action: "EMPLOYEE_DELETE",
      details: `User '${req.user.email}' deleted employee ${id}.`
    });

    return res.json({ success: true, message: "Employee deleted" });
  } catch (err) {
    console.error("deleteEmployee error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
