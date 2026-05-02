import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { BACKEND_URL } from "../../config";

const CreateTaskModal = ({ onClose, onCreated, projectId }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    status: "todo",
  });
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  const handleBackdropClick = (event) => {
    if (cardRef.current && !cardRef.current.contains(event.target)) {
      onClose();
    }
  };

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const payload = {
        title: form.title,
        description: form.description,
        status: form.status,
      };

      if (form.dueDate) {
        payload.dueDate = form.dueDate;
      }

      const response = await axios.post(BACKEND_URL + `task/${projectId}`, payload, {
        withCredentials: true,
      });

      if (response.status === 200) {
        onCreated(response.data.task);
        onClose();
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to create task.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="overlay" onMouseDown={handleBackdropClick} role="presentation">
      <div className="modal-card glass-panel" ref={cardRef}>
        <div className="modal-header">
          <div>
            <div className="inline-row">
              <div className="section-label">Create Task</div>
              <span className="admin-badge">Admin</span>
            </div>
            <h2 className="auth-title" style={{ fontSize: "2rem" }}>
              Add a task to this project
            </h2>
          </div>
          <button className="btn-ghost" onClick={onClose} type="button">
            Close
          </button>
        </div>

        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="input-shell">
            <label htmlFor="create-task-title">Task Title</label>
            <input
              id="create-task-title"
              name="title"
              onChange={handleChange}
              placeholder="Write launch checklist"
              required
              type="text"
              value={form.title}
            />
          </div>

          <div className="input-shell">
            <label htmlFor="create-task-description">Description</label>
            <textarea
              id="create-task-description"
              name="description"
              onChange={handleChange}
              placeholder="Outline the exact work needed for this task."
              required
              value={form.description}
            />
          </div>

          <div className="input-shell">
            <label htmlFor="create-task-due-date">Due Date</label>
            <input
              id="create-task-due-date"
              name="dueDate"
              onChange={handleChange}
              type="date"
              value={form.dueDate}
            />
          </div>

          <div className="input-shell">
            <label htmlFor="create-task-status">Status</label>
            <select
              className="task-status-select"
              id="create-task-status"
              name="status"
              onChange={handleChange}
              value={form.status}
            >
              <option value="todo">Todo</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Done</option>
            </select>
          </div>

          <div className="status-message">{message}</div>

          <div className="button-row">
            <button className="btn-primary" disabled={isSubmitting} type="submit">
              {isSubmitting ? "Creating..." : "Create Task"}
            </button>
            <button className="btn-secondary" onClick={onClose} type="button">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;
