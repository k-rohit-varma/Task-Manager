import { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import Login from "../components/Login";
import Register from "../components/Register";
import { userContext } from "../context/userContext";

const panels = [
  { value: "12", label: "Projects mapped" },
  { value: "48", label: "Tasks organized" },
  { value: "03", label: "Deadlines visible" },
];

const AuthPage = () => {
  const [mode, setMode] = useState("login");
  const { user, isAuthLoading } = useContext(userContext);

  if (!isAuthLoading && user) {
    return <Navigate to="/projects" replace />;
  }

  return (
    <main className="page auth-layout">
      <section className="card-stack">
        <div className="section-label">Secure Access</div>
        <h1 className="headline" style={{ fontSize: "clamp(2.8rem, 7vw, 5rem)" }}>
          Step into your workspace with zero friction.
        </h1>
        <p className="subheadline">
          Sign in to continue managing projects, or create a new account and start
          structuring your work in seconds.
        </p>

        <div className="feature-grid">
          {panels.map((panel) => (
            <article key={panel.label} className="metric-card glass-panel glass-panel-hover">
              <div className="metric-value">{panel.value}</div>
              <div className="metric-label">{panel.label}</div>
            </article>
          ))}
        </div>

        <Link className="btn-ghost" to="/">
          Back to Home
        </Link>
      </section>

      <section className="auth-card glass-panel">
        <div className="auth-toggle">
          <button
            className={mode === "login" ? "active" : ""}
            onClick={() => setMode("login")}
            type="button"
          >
            Login
          </button>
          <button
            className={mode === "signup" ? "active" : ""}
            onClick={() => setMode("signup")}
            type="button"
          >
            Sign Up
          </button>
        </div>

        {mode === "login" ? (
          <Login onSwitchMode={() => setMode("signup")} />
        ) : (
          <Register onSwitchMode={() => setMode("login")} />
        )}
      </section>
    </main>
  );
};

export default AuthPage;
