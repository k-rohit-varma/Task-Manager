import { useContext } from "react";
import { userContext } from "../context/userContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { user, isAuthLoading } = useContext(userContext);

  if (isAuthLoading) {
    return (
      <div className="page route-loading">
        <div className="glass-panel route-loading-card">
          Checking authentication...
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
