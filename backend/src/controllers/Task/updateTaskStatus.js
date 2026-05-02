import Project from "../../db/models/Project.js";
import Task from "../../db/models/Task.js";
import User from "../../db/models/User.js";

const activeStatuses = new Set(["todo", "in_progress", "on_hold"]);

export const updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    if (!taskId || !status) {
      return res.status(400).send({
        message: "Task Id and status are required",
      });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).send({
        message: "Task not found",
      });
    }

    const project = await Project.findById(task.project);
    if (!project) {
      return res.status(404).send({
        message: "Project not found",
      });
    }

    task.status = status;
    task.isCompleted = status === "completed";
    await task.save();

    project.activeTasks = project.activeTasks.filter(
      (activeTaskId) => activeTaskId.toString() !== taskId,
    );
    project.closedTasks = project.closedTasks.filter(
      (closedTaskId) => closedTaskId.toString() !== taskId,
    );

    if (activeStatuses.has(status)) {
      project.activeTasks.push(task._id);
    } else {
      project.closedTasks.push(task._id);
    }

    await project.save();

    if (task.userId) {
      const user = await User.findById(task.userId);

      if (user) {
        user.activeTasks = user.activeTasks.filter(
          (activeTaskId) => activeTaskId.toString() !== taskId,
        );
        user.closedTasks = user.closedTasks.filter(
          (closedTaskId) => closedTaskId.toString() !== taskId,
        );

        if (activeStatuses.has(status)) {
          user.activeTasks.push(task._id);
        } else {
          user.closedTasks.push(task._id);
        }

        await user.save();
      }
    }

    const updatedTask = await Task.findById(taskId).populate("userId", "name email");

    return res.status(200).send({
      message: "Task status updated successfully",
      task: updatedTask,
    });
  } catch (err) {
    return res.status(500).send({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};
