"use client";
import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  ArrowLeft,
  Loader2,
  Check,
  X,
  AlertCircle,
} from "lucide-react";
import { useSignUp } from "@/hooks/use-signup";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Register: React.FC = () => {
  const router = useRouter();
  const { signUp, isLoading } = useSignUp();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [touched, setTouched] = useState({
    email: false,
    password: false,
    confirm: false,
  });

  // Regex helpers
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const hasUpperCase = (pass: string) => /[A-Z]/.test(pass);
  const hasSpecialChar = (pass: string) =>
    /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pass);

  // Requirement Logic
  const getPasswordStatus = () => {
    const isLengthMet = password.length >= 8;
    const isUpperMet = hasUpperCase(password);
    const isSpecialMet = hasSpecialChar(password);
    const isMatchMet = password === confirmPassword && password.length > 0;

    // Helper to determine status for single attributes
    // If met -> success (Green)
    // If not met but user is typing -> warning (Yellow)
    // If empty -> neutral (Gray)
    const getStatus = (met: boolean) => {
      if (met) return "success";
      if (password.length > 0) return "warning";
      return "neutral";
    };

    return [
      {
        label: "At least 8 characters",
        met: isLengthMet,
        status: getStatus(isLengthMet),
      },
      {
        label: "One uppercase letter",
        met: isUpperMet,
        status: getStatus(isUpperMet),
      },
      {
        label: "One special character",
        met: isSpecialMet,
        status: getStatus(isSpecialMet),
      },
      {
        label: "Passwords match",
        met: isMatchMet,
        status: isMatchMet
          ? "success"
          : confirmPassword.length > 0 && password !== confirmPassword
          ? "error" // Show red immediately if they typed a mismatch
          : "neutral",
      },
    ];
  };

  const requirements = getPasswordStatus();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({ email: true, password: true, confirm: true });

    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Comprehensive Password Validation
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (!hasUpperCase(password)) {
      toast.error("Password must contain at least one uppercase letter");
      return;
    }
    if (!hasSpecialChar(password)) {
      toast.error("Password must contain at least one special character");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!agreeTerms) {
      toast.error("Please agree to the terms and conditions");
      return;
    }

    const success = await signUp(email, password, name);

    if (success) {
      toast.success("Account created successfully!");
      setTimeout(() => router.push("/"), 1000);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-green-500";
      case "error":
        return "text-red-500";
      case "warning":
        return "text-yellow-500";
      default:
        return "text-muted-foreground";
    }
  };

  const getIconBg = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-500/20";
      case "error":
        return "bg-red-500/20";
      case "warning":
        return "bg-yellow-500/20";
      default:
        return "bg-muted";
    }
  };

  return (
    <>
      <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden px-4 py-12">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        </div>

        {/* Back Button */}
        <Link
          href="/"
          className="absolute top-6 left-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        <div className="w-full max-w-md relative z-10 animate-fade-up">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-orbitron font-bold text-3xl mb-2">
              Create Account
            </h1>
            <p className="text-muted-foreground">
              Join the future of crypto trading
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="glass-card-purple p-8 space-y-5"
          >
            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-input border border-border rounded-lg px-4 py-3 input-glow focus:outline-none"
                placeholder="John Doe"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                value={email}
                onBlur={() => setTouched({ ...touched, email: true })}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full bg-input border rounded-lg px-4 py-3 input-glow focus:outline-none transition-colors ${
                  touched.email && email && !isValidEmail(email)
                    ? "border-red-500/50 focus:border-red-500"
                    : "border-border"
                }`}
                placeholder="you@example.com"
              />
              {touched.email && email && !isValidEmail(email) && (
                <p className="text-xs text-red-500">Invalid email format</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-input border border-border rounded-lg px-4 py-3 pr-12 input-glow focus:outline-none"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Confirm Password</label>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full bg-input border rounded-lg px-4 py-3 input-glow focus:outline-none ${
                  confirmPassword.length > 0 && password !== confirmPassword
                    ? "border-red-500/50"
                    : "border-border"
                }`}
                placeholder="••••••••"
              />
            </div>

            {/* Password Requirements Visualization */}
            <div className="space-y-3 bg-secondary/5 p-4 rounded-lg border border-secondary/10">
              <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                Password Requirements
              </p>
              {requirements.map((req, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-sm transition-all duration-300"
                >
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors duration-300 ${getIconBg(
                      req.status
                    )}`}
                  >
                    {req.status === "success" && (
                      <Check className="w-3 h-3 text-green-500" />
                    )}
                    {req.status === "error" && (
                      <X className="w-3 h-3 text-red-500" />
                    )}
                    {req.status === "warning" && (
                      <AlertCircle className="w-3 h-3 text-yellow-500" />
                    )}
                    {req.status === "neutral" && (
                      <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
                    )}
                  </div>
                  <span
                    className={`transition-colors duration-300 ${getStatusColor(
                      req.status
                    )}`}
                  >
                    {req.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Terms */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-border bg-input transition-all hover:border-secondary checked:border-secondary checked:bg-secondary"
                />
                <Check className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 text-primary-foreground opacity-0 peer-checked:opacity-100 pointer-events-none" />
              </div>
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                I agree to the{" "}
                <a href="#" className="text-secondary hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-secondary hover:underline">
                  Privacy Policy
                </a>
              </span>
            </label>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full btn-secondary-glow py-6 text-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>

            {/* Sign In Link */}
            <p className="text-center text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/auth/sign-in"
                className="text-secondary hover:underline font-medium"
              >
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
