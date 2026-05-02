import express from "express";
import { createTask } from "../controllers/Task/createTask.js";
import { auth } from "../middleware/auth.js";
import { assignTask } from "../controllers/Task/assignTask.js";
import { getAllTasks } from "../controllers/Task/getAllTasks.js";
import { adminMiddleware } from "../middleware/admin.js";
import { updateTaskStatus } from "../controllers/Task/updateTaskStatus.js";

const taskRouter = express.Router();

taskRouter.get("/:projectId", auth, getAllTasks);
taskRouter.post("/assign", adminMiddleware, assignTask);
taskRouter.patch("/:taskId/status", auth, updateTaskStatus);
taskRouter.post("/:id", auth, createTask);

export default taskRouter;
