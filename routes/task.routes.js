import { Router } from "express";
import auth from "../middleware/auth.js";
import { createTask, getTasks, getTaskById, updateTask, deleteTask } from "../controller/task.controller.js";

const taskRouter = Router();

taskRouter.post("/", auth, createTask);
taskRouter.get("/", auth, getTasks);
taskRouter.get("/:id", auth, getTaskById);
taskRouter.put("/:id", auth, updateTask);
taskRouter.delete("/:id", auth, deleteTask);

export default taskRouter;
