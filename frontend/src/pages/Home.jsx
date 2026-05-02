import { useContext } from "react";
import { Link, Navigate } from "react-router-dom";
import { userContext } from "../context/userContext";

const stats = [
  { value: "12", label: "Projects in Motion" },
  { value: "48", label: "Active Tasks" },
  { value: "03", label: "Deadlines Today" },
  { value: "99%", label: "Clarity Retained" },
];

const features = [
  {
    title: "Effortless Planning",
    text: "Turn scattered tasks into a structured workflow with beautifully layered project spaces.",
  },
  {
    title: "Quiet Focus",
    text: "Every surface is designed to reduce noise so priorities stand out without needing bright color cues.",
  },
  {
    title: "Shared Visibility",
    text: "Track owners, due dates, and delivery status in one premium dashboard built for real momentum.",
  },
];

const Home = () => {
  const { user, isAuthLoading } = useContext(userContext);

  if (!isAuthLoading && user) {
    return <Navigate to="/projects" replace />;
  }

  return (
    <main className="hero-stage">
      <div className="page hero-grid">
        <section className="hero-copy">
          <div className="fade-up section-label">Task Management Reimagined</div>
          <h1 className="fade-up headline">Manage Your Work, Effortlessly</h1>
          <p className="fade-up subheadline">
            A cinematic workspace for teams and solo builders who want clarity, rhythm,
            and premium focus. Track projects, navigate tasks, and move through your day
            with zero visual noise.
          </p>

          <div className="fade-up hero-actions">
            <Link className="btn-primary" to="/auth">
              Login / Sign Up
            </Link>
            <Link className="btn-secondary" to={user ? "/projects" : "/auth"}>
              Explore Dashboard
            </Link>
          </div>

          <div className="feature-grid section-spacer-lg">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="feature-card glass-panel glass-panel-hover fade-up"
              >
                <div className="card-kicker">Feature</div>
                <h2 className="card-title">{feature.title}</h2>
                <p className="card-text">{feature.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="hero-visual hero-side">
          {stats.map((stat) => (
            <article
              key={stat.label}
              className="metric-card glass-panel glass-panel-hover"
            >
              <div className="metric-value">{stat.value}</div>
              <div className="metric-label">{stat.label}</div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
};

export default Home;
