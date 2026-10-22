import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, ArrowRight, Gift } from "lucide-react";
import toast from "react-hot-toast";

import AuthLayout from "../components/layout/AuthLayout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import useAuthStore from "../store/authStore";
import { ROUTES } from "../constants";

function Signup() {
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);
  const isLoading = useAuthStore((state) => state.isLoading);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
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
    if (!form.name.trim()) newErrors.name = "Name is required";
    else if (form.name.trim().length < 2)
      newErrors.name = "Name must be at least 2 characters";
    if (!form.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Please enter a valid email";
    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const result = await register(form.name, form.email, form.password);

    if (result.success) {
      toast.success("Account created! 🎉 Welcome aboard!");
      navigate(ROUTES.DASHBOARD);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Free forever. No credit card. Just learning."
    >
      {/* Welcome bonus banner */}
      <div className="mb-6 p-4 rounded-xl border border-coin/20 bg-coin/[0.05] flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-coin/20 flex items-center justify-center shrink-0">
          <Gift className="w-4 h-4 text-coin" />
        </div>
        <div>
          <p className="text-sm font-medium text-coin">Welcome Bonus 🎁</p>
          <p className="text-xs text-dark-100 mt-0.5">
            Get ₹10,00,000 virtual cash + 100 coins on signup
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Full Name"
          type="text"
          name="name"
          placeholder="Rahul Sharma"
          icon={User}
          value={form.name}
          onChange={handleChange}
          error={errors.name}
          autoComplete="name"
        />

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
          placeholder="At least 6 characters"
          icon={Lock}
          value={form.password}
          onChange={handleChange}
          error={errors.password}
          autoComplete="new-password"
        />

        <Input
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          placeholder="Re-enter password"
          icon={Lock}
          value={form.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          autoComplete="new-password"
        />

        <Button
          type="submit"
          variant="gradient"
          size="lg"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            "Creating account..."
          ) : (
            <>
              Create Free Account
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>

        <p className="text-xs text-dark-100 text-center">
          By signing up, you agree to our{" "}
          <a href="#" className="text-primary-400 hover:underline">
            Terms
          </a>{" "}
          and{" "}
          <a href="#" className="text-primary-400 hover:underline">
            Privacy Policy
          </a>
        </p>
      </form>

      <p className="mt-6 text-center text-sm text-dark-100">
        Already have an account?{" "}
        <Link
          to={ROUTES.LOGIN}
          className="text-primary-400 hover:text-primary-300 font-medium"
        >
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}

export default Signup;