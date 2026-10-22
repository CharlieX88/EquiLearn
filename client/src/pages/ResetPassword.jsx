import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Lock, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

import AuthLayout from "../components/layout/AuthLayout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import api from "../services/api";
import { ROUTES } from "../constants";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.password) return toast.error("Password is required");
    if (form.password.length < 6) return toast.error("Password must be at least 6 characters");
    if (form.password !== form.confirmPassword) return toast.error("Passwords do not match");

    try {
      setLoading(true);
      const { data } = await api.put(`/auth/reset-password/${token}`, {
        password: form.password,
      });
      
      toast.success("Password reset successfully!");
      setSuccess(true);
      
      // Auto-login the user
      if (data.token && data.user) {
        localStorage.setItem("token", data.token);
        setTimeout(() => navigate(ROUTES.DASHBOARD), 2000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid or expired token");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create New Password"
      subtitle="Your new password must be different from previous ones."
    >
      {success ? (
        <div className="text-center p-6 rounded-2xl bg-success/5 border border-success/20">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-success/20 mb-4">
            <CheckCircle2 className="w-6 h-6 text-success" />
          </div>
          <h3 className="text-lg font-bold text-success mb-2">Password Reset!</h3>
          <p className="text-sm text-dark-100 mb-6">
            Redirecting you to your dashboard...
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="New Password"
            type="password"
            placeholder="At least 6 characters"
            icon={Lock}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <Input
            label="Confirm New Password"
            type="password"
            placeholder="Re-enter password"
            icon={Lock}
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
          />

          <Button
            type="submit"
            variant="gradient"
            size="lg"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}

export default ResetPassword;