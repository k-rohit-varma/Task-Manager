import axios from "axios";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../config";
import { userContext } from "../context/userContext";

const CreateProjectPage = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
  });
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useContext(userContext);
  const navigate = useNavigate();

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
      const response = await axios.post(BACKEND_URL + "project", form, {
        withCredentials: true,
      });

      if (response.status === 201) {
        navigate("/projects");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to create project.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="page dashboard-shell">
      <header className="topbar glass-panel">
        <div>
          <div className="topbar-title">{user?.name || "Admin Workspace"}</div>
          <div className="topbar-subtitle">
            Create a fresh project space and make it available from the dashboard.
          </div>
        </div>
        <Link className="btn-secondary" to="/projects">
          Back to Dashboard
        </Link>
      </header>

      <section className="page-heading">
        <div>
          <div className="inline-row">
            <div className="section-label">Admin Panel</div>
            <span className="admin-badge">Admin</span>
          </div>
          <h1>Create a new project.</h1>
          <p>
            Capture the project name, add a short description, and publish it into your
            workspace.
          </p>
        </div>
      </section>

      <section className="auth-card glass-panel" style={{ maxWidth: '760px' }}>
        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="input-shell">
            <label htmlFor="project-name">Project Name</label>
            <input
              id="project-name"
              name="name"
              onChange={handleChange}
              placeholder="Launch website redesign"
              required
              type="text"
              value={form.name}
            />
          </div>

          <div className="input-shell">
            <label htmlFor="project-description">Description</label>
            <textarea
              id="project-description"
              name="description"
              onChange={handleChange}
              placeholder="Outline the project goals, the scope, and the delivery intent."
              required
              value={form.description}
            />
          </div>

          <div className="status-message">{message}</div>

          <div className="button-row">
            <button className="btn-primary" disabled={isSubmitting} type="submit">
              {isSubmitting ? "Creating Project..." : "Create Project"}
            </button>
            <span className="admin-badge">Admin</span>
          </div>
        </form>
      </section>
    </main>
  );
};

export default CreateProjectPage;
