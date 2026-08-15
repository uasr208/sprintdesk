import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider } from "./components/ui/Toast";
import { LoginPage } from "./features/auth/LoginPage";
import { ProtectedRoute, PublicOnlyRoute } from "./routes/ProtectedRoute";
import { AppLayout } from "./components/layout/AppLayout";
import { authService } from "./services/authService";
import { useAuthStore } from "./store/authStore";
import { BoardPage } from "./features/board/BoardPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes cache
    },
  },
});

function DashboardPlaceholder() {
  const { user } = useAuthStore();
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-bold text-slate-100">
        Welcome, {user?.firstName}!
      </h1>
      <p className="text-slate-400">
        Select a menu item from the sidebar to start.
      </p>
    </div>
  );
}

export default function App() {
  useEffect(() => {
    authService.validateSession();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<PublicOnlyRoute />}>
              <Route path="/login" element={<LoginPage />} />
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<DashboardPlaceholder />} />
                <Route path="/board" element={<BoardPage />} />
                <Route path="/analytics" element={<DashboardPlaceholder />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </QueryClientProvider>
  );
}
