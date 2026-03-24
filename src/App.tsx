import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { useAuth } from "./features/auth/AuthProvider";
import { DashboardPage } from "./pages/DashboardPage";
import { LoginPage } from "./pages/LoginPage";
import { ReportEditorPage } from "./pages/ReportEditorPage";
import { SettingsPage } from "./pages/SettingsPage";

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="screen-center">
        <div className="loading-panel">
          <span className="spinner" aria-hidden="true" />
          <p>Loading Farm Report...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <LoginPage />}
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="reports/new" element={<ReportEditorPage mode="create" />} />
        <Route
          path="reports/:reportDocId/edit"
          element={<ReportEditorPage mode="edit" />}
        />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to={user ? "/" : "/login"} replace />} />
    </Routes>
  );
}
