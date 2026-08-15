import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { useToast } from "../../components/ui/Toast";
import { authService } from "../../services/authService";
import { PasswordStrengthIndicator } from "./PasswordStrengthIndicator";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [username, setUsername] = useState("emilys"); // Default DummyJSON user
  const [password, setPassword] = useState("emilyspass");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await authService.login({
        username,
        password,
        expiresInMins: rememberMe ? 43200 : 30, // 30 days vs 30 mins
      });
      addToast("Successfully logged in!", "success");
      navigate("/dashboard");
    } catch {
      setError('Invalid username or password. Try "emilys" and "emilyspass"');
      addToast("Login failed. Please check your credentials.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold text-blue-400">SprintDesk</h1>
          <p className="text-slate-400 text-sm">
            Sign in to manage your engineering sprints
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-900/40 border border-red-700 rounded-lg text-red-200 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
          />

          <div>
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
            <PasswordStrengthIndicator password={password} />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500"
              />
              Remember me (30 days)
            </label>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full py-2.5"
            isLoading={isLoading}
          >
            Sign In
          </Button>
        </form>

        <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-700 text-xs text-slate-400">
          <p className="font-semibold text-slate-300">Demo Credentials:</p>
          <p>
            Username: <code className="text-blue-400">emilys</code>
          </p>
          <p>
            Password: <code className="text-blue-400">emilyspass</code>
          </p>
        </div>
      </div>
    </div>
  );
};
