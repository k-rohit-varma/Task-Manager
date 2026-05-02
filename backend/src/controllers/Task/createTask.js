import Project from "../../db/models/Project.js";
import Task from "../../db/models/Task.js";

export const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, status } = req.body;
    const projectId = req.params.id;

    if (!title || !description || !projectId) {
      return res.status(400).send({
        message: "Title , Description and Project Id are required",
      });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).send({
        message: "Project not found",
      });
    }
    
    const query = {
      title,
      description,
      project: projectId,
    };

    if (dueDate) {
      query.dueDate = dueDate;
    }

    if (status) {
      query.status = status;
      query.isCompleted = status === "completed";
    }

    const result = await Task.create(query);

    if (result.status === "completed") {
      project.closedTasks.push(result._id);
    } else {
      project.activeTasks.push(result._id);
    }
    await project.save();

    const createdTask = await Task.findById(result._id).populate("userId", "name email");

    return res.status(200).send({
      message: "Task Created Successfully",
      task: createdTask,
    });
  } catch (err) {
    return res.status(500).send({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};
