import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../config";
import { userContext } from "../context/userContext";

const Register = ({ onSwitchMode }) => {
  const [form, setForm] = useState({
    name: "",
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
      const response = await axios.post(BACKEND_URL + "user/register", form, {
        withCredentials: true,
      });

      if (response.status === 201) {
        setUser(response.data.user);
        await refreshUser();
        navigate("/projects");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to create your account.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-form-block">
      <div className="section-label">Create Account</div>
      <h2 className="auth-title">Start Fresh</h2>
      <p className="helper-text section-spacer-md">
        Build a new workspace identity and jump directly into your projects.
      </p>

      <form className="form-grid" onSubmit={handleSubmit}>
        <div className="input-shell">
          <label htmlFor="signup-name">Name</label>
          <input
            id="signup-name"
            name="name"
            onChange={handleChange}
            placeholder="Your full name"
            required
            type="text"
            value={form.name}
          />
        </div>

        <div className="input-shell">
          <label htmlFor="signup-email">Email</label>
          <input
            id="signup-email"
            name="email"
            onChange={handleChange}
            placeholder="you@example.com"
            required
            type="email"
            value={form.email}
          />
        </div>

        <div className="input-shell">
          <label htmlFor="signup-password">Password</label>
          <input
            id="signup-password"
            name="password"
            onChange={handleChange}
            placeholder="Create a strong password"
            required
            type="password"
            value={form.password}
          />
        </div>

        <div className="status-message">{message}</div>

        <button className="btn-primary auth-submit" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Creating Account..." : "Sign Up"}
        </button>
      </form>

      <p className="helper-text section-spacer-md">
        Already registered?{" "}
        <button className="btn-ghost auth-switch" onClick={onSwitchMode} type="button">
          Switch to login
        </button>
      </p>
    </div>
  );
};

export default Register;
