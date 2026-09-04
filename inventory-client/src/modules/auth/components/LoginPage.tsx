// src/modules/auth/components/LoginPage.tsx

import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  showSuccess,
  showError,
  showLoading,
  dismissToast,
} from "../../../shared/utils/toast";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    const loadingToast = showLoading("Signing in...");

    try {
      await login(email, password);

      dismissToast(loadingToast);
      showSuccess("Login successful! Redirecting...");

      const from = (location.state as any)?.from || "/dashboard";
      console.log("Redirecting to:", from);
      setTimeout(() => navigate(from, { replace: true }), 500);
    } catch (error: any) {
      dismissToast(loadingToast);
      const message = error.message || "Login failed";
      setErrorMessage(message);
      showError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-950 p-4 sm:p-6 lg:p-8 font-sans text-slate-900 selection:bg-emerald-500 selection:text-white">
      {/* Background Decorative Emerald Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Dual-Column Card */}
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl shadow-slate-950/60 border border-slate-100 overflow-hidden flex flex-col md:flex-row min-h-[500px]">
        {/* Left Branding Panel */}
        <div className="md:w-5/12 bg-gradient-to-br from-emerald-700 via-emerald-800 to-slate-950 text-white p-8 lg:p-10 flex flex-col justify-between relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute -top-12 -right-12 w-56 h-56 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center mb-6 shadow-sm backdrop-blur-xs">
              <i className="fas fa-cubes text-xl text-emerald-300" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight mb-2">
              Welcome back
            </h2>
            <p className="text-sm text-emerald-100/90 leading-relaxed">
              Access your internal equipment and asset management portal
              securely.
            </p>
          </div>

          <div className="relative z-10 space-y-3 my-8">
            <div className="flex items-center gap-3 text-sm text-emerald-100">
              <i className="fas fa-shield-alt text-emerald-300 text-sm" />
              <span>Role-based authorization</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-emerald-100">
              <i className="fas fa-bolt text-emerald-300 text-sm" />
              <span>Real-time tracking</span>
            </div>
          </div>

          <div className="relative z-10 pt-4 text-xs text-emerald-200/70 border-t border-emerald-600/40">
            &copy; {new Date().getFullYear()} Equipment & Asset Release
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="md:w-7/12 p-8 sm:p-10 lg:p-12 flex flex-col justify-center bg-white">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Sign In
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Enter your credentials to manage your account
            </p>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className="flex items-start gap-3 p-3.5 rounded-xl text-sm mb-6 bg-rose-50 border border-rose-200 text-rose-800">
              <i className="fas fa-circle-exclamation text-rose-500 mt-0.5 shrink-0" />
              <span className="leading-relaxed font-medium">
                {errorMessage}
              </span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative group">
                <i className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm transition-colors group-focus-within:text-emerald-600" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-normal text-slate-900 placeholder:text-slate-400 transition-all duration-150 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/15"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative group">
                <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm transition-colors group-focus-within:text-emerald-600" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-normal text-slate-900 placeholder:text-slate-400 transition-all duration-150 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/15"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 transition-colors rounded-lg focus:outline-none"
                >
                  <i
                    className={`fas ${
                      showPassword ? "fa-eye-slash" : "fa-eye"
                    } text-sm`}
                  />
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 select-none">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500/20"
                />
                <span className="text-xs font-medium">Remember me</span>
              </label>

              <Link
                to="/forgot-password"
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-500 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white rounded-xl text-sm font-semibold tracking-wide transition-all duration-150 shadow-md shadow-emerald-600/20 hover:shadow-lg hover:shadow-emerald-600/30 disabled:opacity-60 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
