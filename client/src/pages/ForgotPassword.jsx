import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

import AuthLayout from "../components/layout/AuthLayout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import api from "../services/api";
import { ROUTES } from "../constants";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Email is required");

    try {
      setLoading(true);
      const { data } = await api.post("/auth/forgot-password", { email });
      toast.success(data.message);
      setSuccess(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Forgot Password"
      subtitle="Enter your email and we'll send you a reset link."
    >
      {success ? (
        <div className="text-center p-6 rounded-2xl bg-success/5 border border-success/20">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-success/20 mb-4">
            <CheckCircle2 className="w-6 h-6 text-success" />
          </div>
          <h3 className="text-lg font-bold text-success mb-2">Email Sent!</h3>
          <p className="text-sm text-dark-100 mb-6">
            Please check your email for the reset link.
          </p>
          <Link to={ROUTES.LOGIN}>
            <Button variant="gradient" className="w-full">
              Back to Login
            </Button>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            icon={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Button
            type="submit"
            variant="gradient"
            size="lg"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>
      )}

      {!success && (
        <div className="mt-6 text-center">
          <Link
            to={ROUTES.LOGIN}
            className="inline-flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </div>
      )}
    </AuthLayout>
  );
}

export default ForgotPassword;