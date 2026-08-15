import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastProvider } from "./components/ui/Toast";
import { LoginPage } from "./features/auth/LoginPage";
import { ProtectedRoute, PublicOnlyRoute } from "./routes/ProtectedRoute";
import { authService } from "./services/authService";
import { useAuthStore } from "./store/authStore";
import { Button } from "./components/ui/Button";

function DashboardPlaceholder() {
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8 space-y-4">
      <h1 className="text-2xl font-bold text-blue-400">
        Welcome to SprintDesk, {user?.firstName}!
      </h1>
      <p className="text-slate-400">Logged in as {user?.email}</p>
      <Button variant="danger" onClick={logout}>
        Log Out
      </Button>
    </div>
  );
}

export default function App() {
  useEffect(() => {
    authService.validateSession();
  }, []);

  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicOnlyRoute />}>
            <Route path="/login" element={<LoginPage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPlaceholder />} />
            <Route path="/board" element={<DashboardPlaceholder />} />
            <Route path="/analytics" element={<DashboardPlaceholder />} />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}
