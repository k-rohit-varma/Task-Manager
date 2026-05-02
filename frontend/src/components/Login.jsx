import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../config";
import { userContext } from "../context/userContext";

const Login = ({ onSwitchMode }) => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { setUser, refreshUser } = useContext(userContext);

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
      const response = await axios.post(BACKEND_URL + "user/login", form, {
        withCredentials: true,
      });

      if (response.status === 200) {
        setUser(response.data.user);
        await refreshUser();
        navigate("/projects");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to sign in right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-form-block">
      <div className="section-label">Welcome Back</div>
      <h2 className="auth-title">Login to Continue</h2>
      <p className="helper-text section-spacer-md">
        Return to your dashboard, review active projects, and keep delivery moving.
      </p>

      <form className="form-grid" onSubmit={handleSubmit}>
        <div className="input-shell">
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            name="email"
            onChange={handleChange}
            placeholder="you@example.com"
            required
            type="email"
            value={form.email}
          />
        </div>

        <div className="input-shell">
          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            name="password"
            onChange={handleChange}
            placeholder="Enter your password"
            required
            type="password"
            value={form.password}
          />
        </div>

        <div className="status-message">{message}</div>

        <button className="btn-primary auth-submit" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Signing In..." : "Sign In"}
        </button>
      </form>

      <p className="helper-text section-spacer-md">
        New here?{" "}
        <button className="btn-ghost auth-switch" onClick={onSwitchMode} type="button">
          Create an account
        </button>
      </p>
    </div>
  );
};

export default Login;
