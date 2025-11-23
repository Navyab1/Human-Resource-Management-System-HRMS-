import { Sequelize, DataTypes } from "sequelize";
import { DB_STORAGE } from "./env.js";

export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: DB_STORAGE,
  logging: false
});

export const Organisation = sequelize.define("Organisation", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false }
});

export const User = sequelize.define("User", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  passwordHash: { type: DataTypes.STRING, allowNull: false }
});

export const Employee = sequelize.define("Employee", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  position: { type: DataTypes.STRING, allowNull: true }
});

export const Team = sequelize.define("Team", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: true }
});

export const EmployeeTeam = sequelize.define("EmployeeTeam", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
});

export const LogEntry = sequelize.define("LogEntry", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  action: { type: DataTypes.STRING, allowNull: false },
  details: { type: DataTypes.TEXT, allowNull: true }
});

Organisation.hasMany(User, { foreignKey: "organisationId" });
User.belongsTo(Organisation, { foreignKey: "organisationId" });

Organisation.hasMany(Employee, { foreignKey: "organisationId" });
Employee.belongsTo(Organisation, { foreignKey: "organisationId" });

Organisation.hasMany(Team, { foreignKey: "organisationId" });
Team.belongsTo(Organisation, { foreignKey: "organisationId" });

Employee.belongsToMany(Team, { through: EmployeeTeam, foreignKey: "employeeId" });
Team.belongsToMany(Employee, { through: EmployeeTeam, foreignKey: "teamId" });

Organisation.hasMany(LogEntry, { foreignKey: "organisationId" });
LogEntry.belongsTo(Organisation, { foreignKey: "organisationId" });

User.hasMany(LogEntry, { foreignKey: "userId" });
LogEntry.belongsTo(User, { foreignKey: "userId" });
