import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BACKEND_URL } from "../../config";
import CreateTaskModal from "../components/CreateTaskModal";
import TaskAssignmentPanel from "../components/TaskAssignmentPanel";
import { userContext } from "../context/userContext";

const statusMap = {
  todo: "Todo",
  in_progress: "In Progress",
  completed: "Done",
};

const formatDate = (value) => {
  if (!value) {
    return "No due date";
  }

  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const ProjectTasksPage = () => {
  const { projectId } = useParams();
  const { user } = useContext(userContext);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [activeTaskAssignId, setActiveTaskAssignId] = useState("");
  const [updatingTaskId, setUpdatingTaskId] = useState("");
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [highlightedTaskId, setHighlightedTaskId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksResponse, projectsResponse] = await Promise.all([
          axios.get(BACKEND_URL + `task/${projectId}`, {
            withCredentials: true,
          }),
          axios.get(BACKEND_URL + "project", {
            withCredentials: true,
          }),
        ]);

        setTasks(tasksResponse.data?.tasks || []);
        setProjects(projectsResponse.data?.projects || []);
      } catch (error) {
        setMessage(error.response?.data?.message || "Failed to load tasks.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  useEffect(() => {
    if (!toastMessage) {
      return undefined;
    }

    const timeout = setTimeout(() => {
      setToastMessage("");
    }, 2400);

    return () => clearTimeout(timeout);
  }, [toastMessage]);

  useEffect(() => {
    if (!highlightedTaskId) {
      return undefined;
    }

    const timeout = setTimeout(() => {
      setHighlightedTaskId("");
    }, 1800);

    return () => clearTimeout(timeout);
  }, [highlightedTaskId]);

  const project = projects.find((entry) => entry._id === projectId);
  const openTasks = tasks.filter((task) => task.status !== "completed");
  const completedTasks = tasks.filter((task) => task.status === "completed");

  const updateTaskInState = (updatedTask) => {
    setTasks((current) =>
      current.map((task) => (task._id === updatedTask._id ? updatedTask : task)),
    );
  };

  const handleStatusChange = async (taskId, status) => {
    setUpdatingTaskId(taskId);
    setMessage("");

    try {
      const response = await axios.patch(
        BACKEND_URL + `task/${taskId}/status`,
        { status },
        {
          withCredentials: true,
        },
      );

      if (response.status === 200) {
        updateTaskInState(response.data.task);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to update task status.");
    } finally {
      setUpdatingTaskId("");
    }
  };

  const handleTaskCreated = (createdTask) => {
    setTasks((current) => [createdTask, ...current]);
    setHighlightedTaskId(createdTask._id);
    setToastMessage("Task created successfully.");
  };

  const renderTaskCard = (task) => {
    const isAdmin = user?.role === "admin";
    const isCompleted = task.status === "completed";
    const assignee = task.userId?.name || task.userId?.email || "Unassigned";
    const showAssignPanel = activeTaskAssignId === task._id;
    const isNewlyCreated = highlightedTaskId === task._id;

    return (
      <article
        key={task._id}
        className={`task-card glass-panel ${isCompleted ? "is-completed" : "glass-panel-hover"} ${isNewlyCreated ? "flash-new" : ""}`}
      >
        <div className="task-header">
          <div>
            <div className="card-kicker">Task</div>
            <h2 className={`card-title task-title ${isCompleted ? "is-completed" : ""}`}>
              {task.title || "Untitled Task"}
            </h2>
          </div>
          <span className="status-badge" data-status={task.status}>
            {statusMap[task.status] || "Todo"}
          </span>
        </div>

        <p className="card-text">
          {task.description || "No description provided for this task."}
        </p>

        <div className="meta-row">
          <span className="meta-pill">Assigned To: {assignee}</span>
          <span className="meta-pill">Due: {formatDate(task.dueDate)}</span>
        </div>

        <div className="task-controls">
          <div className="task-status-row">
            <label htmlFor={`status-${task._id}`}>Status</label>
            <select
              className="task-status-select"
              disabled={updatingTaskId === task._id}
              id={`status-${task._id}`}
              onChange={(event) => handleStatusChange(task._id, event.target.value)}
              value={task.status}
            >
              <option value="todo">Todo</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Done</option>
            </select>
          </div>

          {isAdmin ? (
            <div className="button-row">
              <button
                className="btn-secondary"
                onClick={() =>
                  setActiveTaskAssignId((current) => (current === task._id ? "" : task._id))
                }
                type="button"
              >
                {task.userId ? "Reassign" : "Assign"}
              </button>
              <span className="admin-badge">Admin</span>
            </div>
          ) : null}

          {showAssignPanel ? (
            <TaskAssignmentPanel
              onAssigned={updateTaskInState}
              onClose={() => setActiveTaskAssignId("")}
              task={task}
            />
          ) : null}
        </div>
      </article>
    );
  };

  return (
    <>
      <main className="page dashboard-shell">
        <header className="topbar glass-panel">
          <div>
            <div className="topbar-title">{project?.name || "Project Detail"}</div>
            <div className="topbar-subtitle">
              {project?.description || "Every task for this project is laid out below."}
            </div>
          </div>
          <div className="topbar-actions">
            {user?.role === "admin" ? (
              <button className="btn-secondary" onClick={() => setIsCreateTaskOpen(true)} type="button">
                <span className="inline-row">
                  <span>+ Create Task</span>
                  <span className="admin-badge">Admin</span>
                </span>
              </button>
            ) : null}
            <Link className="btn-secondary" to="/projects">
              Back to Projects
            </Link>
          </div>
        </header>

        <section className="page-heading">
          <div>
            <div className="section-label">Task View</div>
            <h1>Tasks that stay focused and easy to act on.</h1>
            <p>
              Update status, assign owners, and add fresh work without leaving the project
              context or reloading the page.
            </p>
          </div>
        </section>

        {message ? <div className="empty-state glass-panel">{message}</div> : null}

        {isLoading ? (
          <div className="empty-state glass-panel">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="empty-state glass-panel">
            This project has no tasks yet. Admins can create the first one from the
            button above.
          </div>
        ) : (
          <>
            <section className="task-grid">
              {openTasks.map((task) => renderTaskCard(task))}
            </section>

            {completedTasks.length > 0 ? (
              <>
                <div className="section-divider" />
                <section>
                  <h2 className="completed-section-title">Completed Tasks</h2>
                  <div className="task-grid">
                    {completedTasks.map((task) => renderTaskCard(task))}
                  </div>
                </section>
              </>
            ) : null}
          </>
        )}
      </main>

      {isCreateTaskOpen ? (
        <CreateTaskModal
          onClose={() => setIsCreateTaskOpen(false)}
          onCreated={handleTaskCreated}
          projectId={projectId}
        />
      ) : null}

      {toastMessage ? (
        <div className="toast-stack">
          <div className="toast glass-panel">{toastMessage}</div>
        </div>
      ) : null}
    </>
  );
};

export default ProjectTasksPage;
