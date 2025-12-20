"use client";
import React, { useState } from "react";
import { Eye, EyeOff, ArrowLeft, Loader2 } from "lucide-react";
import { useSignIn } from "@/hooks/use-signin"; // Import the new hook
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

const SignIn: React.FC = () => {
  const router = useRouter();
  // Use the custom hook
  const { signIn, isLoading, error } = useSignIn();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic Validation
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    // Attempt Sign In
    const success = await signIn(email, password);

    if (success) {
      toast.success("Welcome back!");
      // Optional: Add a small delay for better UX
      router.push("/");
    }
    // Note: If failed, the hook handles the specific error toast
  };

  return (
    <>
      <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden px-4">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
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
              Welcome Back
            </h1>
            <p className="text-muted-foreground">Sign in to continue trading</p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="glass-card-blue p-8 space-y-6"
          >
            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full bg-input border rounded-lg px-4 py-3 input-glow focus:outline-none transition-colors ${
                  error ? "border-red-500/50" : "border-border"
                }`}
                placeholder="you@example.com"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full bg-input border rounded-lg px-4 py-3 pr-12 input-glow focus:outline-none transition-colors ${
                    error ? "border-red-500/50" : "border-border"
                  }`}
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

            {/* Submit */}
            <Button
              type="submit"
              className="w-full btn-primary-glow py-6 text-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>

            {/* Register Link */}
            <p className="text-center text-muted-foreground">
              Don't have an account?{" "}
              <Link
                href="/auth/sign-up"
                className="text-primary hover:underline font-medium"
              >
                Create one
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignIn;
