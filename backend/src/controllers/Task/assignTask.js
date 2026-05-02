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

    user.activeTasks.push(taskId);
    await user.save();

    task.userId = userId;
    await task.save();

    return res.status(200).send({
      message: "Task Assigned Successfully",
      task,
    });
  } catch (err) {
    return res.status(500).send({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};
