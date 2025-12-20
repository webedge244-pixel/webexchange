// components/AuthProvider.tsx (Client Component)
"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/authstore";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const listenToAuthChanges = useAuthStore(
    (state) => state.listenToAuthChanges
  );
  const checkUser = useAuthStore((state) => state.checkUser);

  useEffect(() => {
    // Start listening to Firebase auth changes
    const unsubscribe = listenToAuthChanges();
    checkUser(); // Initial check on mount

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, [listenToAuthChanges]);

  return <>{children}</>;
}
