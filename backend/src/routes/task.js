import express from "express";
import { createTask } from "../controllers/Task/createTask.js";
import { auth } from "../middleware/auth.js";
import { assignTask } from "../controllers/Task/assignTask.js";
import { getAllTasks } from "../controllers/Task/getAllTasks.js";

const taskRouter = express.Router();

taskRouter.get("/:projectId", auth, getAllTasks);
taskRouter.post("/assign", auth, assignTask);
taskRouter.post("/:id", auth, createTask);

export default taskRouter;
