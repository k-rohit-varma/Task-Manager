import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { userContext } from "../context/userContext";

const AdminRoute = ({ children }) => {
  const { user, isAuthLoading } = useContext(userContext);

  if (isAuthLoading) {
    return (
      <div className="page route-loading">
        <div className="glass-panel route-loading-card">Checking admin access...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate replace to="/" />;
  }

  if (user.role !== "admin") {
    return <Navigate replace to="/projects" />;
  }

  return children;
};

export default AdminRoute;
