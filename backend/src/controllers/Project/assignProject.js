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

    const projectHasUser = project.users.some(
      (assignedUserId) => assignedUserId.toString() === userId,
    );
    const userHasProject = user.projects.some(
      (assignedProjectId) => assignedProjectId.toString() === projectId,
    );

    if (!projectHasUser) {
      project.users.push(userId);
    }
    await project.save();

    if (!userHasProject) {
      user.projects.push(projectId);
    }
    await user.save();

    const updatedProject = await Project.findById(projectId).populate("users", "name email role");

    return res.status(200).send({
      message: "Project Assigned Successfully",
      project: updatedProject,
    });
  } catch (err) {
    return res.status(500).send({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};
