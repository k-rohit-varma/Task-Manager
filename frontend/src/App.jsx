import AdminRoute from "./components/AdminRoute";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthPage from "./pages/AuthPage";
import CreateProjectPage from "./pages/CreateProjectPage";
import Home from "./pages/Home";
import ProjectTasksPage from "./pages/ProjectTasksPage";
import ProjectsDashboard from "./pages/ProjectsDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/admin/projects/new"
            element={
              <AdminRoute>
                <CreateProjectPage />
              </AdminRoute>
            }
          />
          <Route
            path="/projects"
            element={
              <ProtectedRoute>
                <ProjectsDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects/:projectId"
            element={
              <ProtectedRoute>
                <ProjectTasksPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
