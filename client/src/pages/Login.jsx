import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

import AuthLayout from "../components/layout/AuthLayout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import useAuthStore from "../store/authStore";
import { ROUTES } from "../constants";

function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  // Agar already logged in hai, dashboard pe bhejo
  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.DASHBOARD, { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Please enter a valid email";
    if (!form.password) newErrors.password = "Password is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const result = await login(form.email, form.password);

    if (result.success) {
      toast.success(`Welcome back, ${result.user.name}! 👋`);
      navigate(ROUTES.DASHBOARD);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Continue your learning journey."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Email"
          type="email"
          name="email"
          placeholder="you@example.com"
          icon={Mail}
          value={form.email}
          onChange={handleChange}
          error={errors.email}
          autoComplete="email"
        />

        <Input
          label="Password"
          type="password"
          name="password"
          placeholder="••••••••"
          icon={Lock}
          value={form.password}
          onChange={handleChange}
          error={errors.password}
          autoComplete="current-password"
        />

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-dark-100 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-white/20 bg-white/5 accent-primary-600"
            />
            Remember me
          </label>
          <Link to={ROUTES.FORGOT_PASSWORD || "/forgot-password"} className="text-primary-400 hover:text-primary-300 transition-colors">
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="gradient"
          size="lg"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            "Signing in..."
          ) : (
            <>
              Sign In
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-dark-100">
        Don't have an account?{" "}
        <Link
          to={ROUTES.SIGNUP}
          className="text-primary-400 hover:text-primary-300 font-medium"
        >
          Create free account
        </Link>
      </p>
    </AuthLayout>
  );
}

export default Login;