import Project from "../../db/models/Project.js";
import Task from "../../db/models/Task.js";
import User from "../../db/models/User.js";

export const assignTask = async (req, res) => {
  try {
    const { taskId, userId } = req.body;
    if (!taskId || !userId) {
      return res.status(400).send({
        message: "Task Id and User Id are required",
      });
    }
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).send({
        message: "Task not found",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({
        message: "User not found",
      });
    }

    const project = await Project.findById(task.project);
    if (!project) {
      return res.status(404).send({
        message: "Project not found",
      });
    }

    const previousUserId = task.userId?.toString();

    if (previousUserId && previousUserId !== userId) {
      const previousUser = await User.findById(previousUserId);

      if (previousUser) {
        previousUser.activeTasks = previousUser.activeTasks.filter(
          (activeTaskId) => activeTaskId.toString() !== taskId,
        );
        previousUser.closedTasks = previousUser.closedTasks.filter(
          (closedTaskId) => closedTaskId.toString() !== taskId,
        );
        await previousUser.save();
      }
    }

    user.activeTasks = user.activeTasks.filter(
      (activeTaskId) => activeTaskId.toString() !== taskId,
    );
    user.closedTasks = user.closedTasks.filter(
      (closedTaskId) => closedTaskId.toString() !== taskId,
    );

    if (task.status === "completed") {
      user.closedTasks.push(taskId);
    } else {
      user.activeTasks.push(taskId);
    }

    await user.save();

    const projectHasUser = project.users.some(
      (assignedUserId) => assignedUserId.toString() === userId,
    );
    const userHasProject = user.projects.some(
      (assignedProjectId) => assignedProjectId.toString() === task.project.toString(),
    );

    if (!projectHasUser) {
      project.users.push(userId);
      await project.save();
    }

    if (!userHasProject) {
      user.projects.push(task.project);
      await user.save();
    }

    task.userId = userId;
    await task.save();
    const updatedTask = await Task.findById(taskId).populate("userId", "name email");

    return res.status(200).send({
      message: "Task Assigned Successfully",
      task: updatedTask,
    });
  } catch (err) {
    return res.status(500).send({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};
