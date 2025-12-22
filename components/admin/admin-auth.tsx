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

  // 1. Memoize the allowed emails list to prevent unnecessary recalculations
  const allowedEmailList = useMemo(() => {
    // Prevent SSR errors
    if (typeof window === "undefined") return [];

    const envEmails =
      process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(",")
        .map((s) => s.trim())
        .filter(Boolean) || [];

    return allowedEmails?.length
      ? allowedEmails
      : envEmails.length
      ? envEmails
      : ["midnightddp@gmail.com"];
  }, [allowedEmails]);

  useEffect(() => {
    // 2. The observer waits for the initial auth handshake (local storage check)
    // This handles the "network delay" automatically because it won't fire
    // with 'null' until it is certain the user isn't logged in locally.
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user && user.email && allowedEmailList.includes(user.email)) {
        setStatus("authorized");
      } else {
        // Even if user exists but isn't an admin, they are "unauthorized"
        setStatus("unauthorized");
      }
    });

    return () => unsubscribe();
  }, [allowedEmailList]);

  // 3. Handle the Redirect as a side effect
  useEffect(() => {
    if (status === "unauthorized") {
      router.replace(redirectTo);
    }
  }, [status, router, redirectTo]);

  // 4. Show Loader if Loading OR if Unauthorized (while redirecting)
  // This prevents the "Flash of Un-Authorized content" before the redirect kicks in.
  if (status === "loading" || status === "unauthorized") {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="mb-2 text-gray-600 font-medium">
            Verifying admin access…
          </div>
          {/*  - Using CSS here for speed */}
          <div className="mx-auto h-6 w-6 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
        </div>
      </div>
    );
  }

  // Only render children when strictly authorized
  return <>{children}</>;
}
