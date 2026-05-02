import Project from "../../db/models/Project.js";
import User from "../../db/models/User.js";

export const assignProject = async (req, res) => {
  try {
    const { projectId, userId } = req.body;
    if (!projectId || !userId) {
      return res.status(400).send({
        message: "Project Id and User Id are required",
      });
    }
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).send({
        message: "Project not found",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({
        message: "User not found",
      });
    }

    project.users.push(userId);
    await project.save();

    user.projects.push(projectId);
    await user.save();

    return res.status(200).send({
      message: "Project Assigned Successfully",
      project
    });
  } catch (err) {
    return res.status(500).send({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};
