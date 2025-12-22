import { useState } from "react";
import { auth } from "@/lib/firebase"; 
import { signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation"; // Added router

export const useSignIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const signIn = async (email: string, pass: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. Firebase Client Side Login
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      const idToken = await userCredential.user.getIdToken();

      // 2. Sync session to Server Cookie
      const response = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) throw new Error("Failed to establish server session");

      // 3. Success!
      toast.success("Signed in successfully");
      router.refresh(); // Refresh to let middleware see the new cookie
      return true;
    } catch (err: any) {
      console.error("Login Error:", err);
      let errorMessage = "Invalid email or password.";
      // ... your existing error mapping ...
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { signIn, isLoading, error };
};