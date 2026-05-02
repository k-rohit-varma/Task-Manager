import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BACKEND_URL } from "../../config";
import LogOut from "../components/LogOut";
import ProjectAssignmentPanel from "../components/ProjectAssignmentPanel";
import { userContext } from "../context/userContext";

const ProjectsDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [activeProjectAssignId, setActiveProjectAssignId] = useState("");
  const { user } = useContext(userContext);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(BACKEND_URL + "project", {
          withCredentials: true,
        });

        setProjects(response.data?.projects || []);
      } catch (error) {
        setMessage(error.response?.data?.message || "Failed to load projects.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const updateProjectInState = (updatedProject) => {
    setProjects((current) =>
      current.map((project) => (project._id === updatedProject._id ? updatedProject : project)),
    );
  };

  const totalTasks = projects.reduce(
    (sum, project) =>
      sum + (project.activeTasks?.length || 0) + (project.closedTasks?.length || 0),
    0,
  );

  return (
    <main className="page dashboard-shell">
      <header className="topbar glass-panel">
        <div>
          <div className="topbar-title">{user?.name || "Workspace"}</div>
          <div className="topbar-subtitle">
            Your projects, priorities, and progress arranged in a cleaner command center.
          </div>
        </div>
        <div className="topbar-actions">
          <div className="meta-pill">{projects.length} Projects</div>
          <div className="meta-pill">{totalTasks} Tasks</div>
          {user?.role === "admin" ? (
            <Link className="btn-secondary" to="/admin/projects/new">
              <span className="inline-row">
                <span>Create Project</span>
                <span className="admin-badge">Admin</span>
              </span>
            </Link>
          ) : null}
          <LogOut />
        </div>
      </header>

      <section className="page-heading">
        <div>
          <div className="section-label">Projects Dashboard</div>
          <h1>Projects arranged for fast scanning.</h1>
          <p>
            Open any project, assign teammates, and move into the task layer without the
            visual clutter of a heavy admin console.
          </p>
        </div>
      </section>

      {isLoading ? (
        <div className="empty-state glass-panel">Loading your projects...</div>
      ) : message ? (
        <div className="empty-state glass-panel">{message}</div>
      ) : projects.length === 0 ? (
        <div className="empty-state glass-panel">
          No projects are assigned yet. Once projects are created in the backend, they
          will appear here automatically.
        </div>
      ) : (
        <section className="dashboard-grid">
          {projects.map((project) => {
            const totalProjectTasks =
              (project.activeTasks?.length || 0) + (project.closedTasks?.length || 0);
            const projectMembers = project.users || [];
            const showAssignPanel = activeProjectAssignId === project._id;

            return (
              <article key={project._id} className="project-card glass-panel glass-panel-hover">
                <div className="project-card-header">
                  <div>
                    <div className="card-kicker">Project</div>
                    <h2 className="card-title">{project.name || "Untitled Project"}</h2>
                  </div>
                  {user?.role === "admin" ? (
                    <span className="admin-badge">Admin</span>
                  ) : null}
                </div>

                <p className="card-text">
                  {project.description || "No description has been added for this project yet."}
                </p>

                <div className="project-card-stats">
                  <div className="project-stat">
                    <div className="project-stat-value">{totalProjectTasks}</div>
                    <div className="project-stat-label">Tasks</div>
                  </div>
                  <div className="project-stat">
                    <div className="project-stat-value">{projectMembers.length}</div>
                    <div className="project-stat-label">Members</div>
                  </div>
                </div>

                <div className="project-members">
                  {projectMembers.length > 0 ? (
                    projectMembers.slice(0, 4).map((member) => (
                      <span className="project-member-chip" key={member._id}>
                        {member.name}
                      </span>
                    ))
                  ) : (
                    <span className="project-member-chip">No members yet</span>
                  )}
                </div>

                <div className="project-card-footer">
                  <Link className="btn-primary inline-action" to={`/projects/${project._id}`}>
                    View Tasks
                  </Link>

                  {user?.role === "admin" ? (
                    <button
                      className="btn-secondary"
                      onClick={() =>
                        setActiveProjectAssignId((current) =>
                          current === project._id ? "" : project._id,
                        )
                      }
                      type="button"
                    >
                      {projectMembers.length > 0 ? "Assign Member" : "Add Member"}
                    </button>
                  ) : null}
                </div>

                {showAssignPanel ? (
                  <div className="section-spacer-md">
                    <ProjectAssignmentPanel
                      onAssigned={updateProjectInState}
                      onClose={() => setActiveProjectAssignId("")}
                      project={project}
                    />
                  </div>
                ) : null}
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
};

export default ProjectsDashboard;
