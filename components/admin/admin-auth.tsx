"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";

type Props = {
  children: React.ReactNode;
  allowedEmails?: string[];
  redirectTo?: string;
};

type AuthStatus = "loading" | "authorized" | "unauthorized";

export default function AdminAuth({
  children,
  allowedEmails,
  redirectTo = "/auth/sign-in",
}: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<AuthStatus>("loading");

  const allowedEmailList = useMemo(() => {
    if (typeof window === "undefined") return [];

    const envEmails =
      process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(",")
        .map((s) => s.trim())
        .filter(Boolean) || [];

    return allowedEmails?.length
      ? allowedEmails
      : envEmails.length
      ? envEmails
      : ["webedge244@gmail.com"];
  }, [allowedEmails]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user && user.email && allowedEmailList.includes(user.email)) {
        setStatus("authorized");
      } else {
        setStatus("unauthorized");
      }
    });

    return () => unsubscribe();
  }, [allowedEmailList]);

  useEffect(() => {
    if (status === "unauthorized") {
      router.replace(redirectTo);
    }
  }, [status, router, redirectTo]);

  // 🌌 Loading / Redirect State (Design Only)
  if (status === "loading" || status === "unauthorized") {
    return (
      <div className="min-h-screen bg-background relative flex items-center justify-center overflow-hidden">
        {/* Ambient Background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
        </div>

        {/* Loader Card */}
        <div className="relative z-10 glass-card px-10 py-8 text-center space-y-5">
          <h2 className="font-orbitron font-semibold text-lg">
            Verifying Access
          </h2>

          <p className="text-sm text-muted-foreground">
            Checking admin credentials…
          </p>

          {/* Spinner */}
          <div className="flex justify-center pt-2">
            <div className="w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
