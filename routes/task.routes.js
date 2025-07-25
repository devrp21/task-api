import Router from "express";
import auth from "../middleware/auth.js";
import { createTask,getTasks,updateTask } from "../controller/task.controller.js";

const taskRouter = Router();

taskRouter.post("/", auth, createTask);
taskRouter.get("/", auth, getTasks);
taskRouter.put("/:id", auth, updateTask);

export default taskRouter;
