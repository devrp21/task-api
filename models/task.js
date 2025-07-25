import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./user.js";

const Task=sequelize.define("Task", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    status:{type: DataTypes.STRING, allowNull: false, defaultValue: "pending"},
});

User.hasMany(Task);
Task.belongsTo(User);

export default Task;