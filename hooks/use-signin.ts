import { useState } from "react";
import { auth } from "@/lib/firebase"; // Adjust path to your firebase config
import { signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "sonner";

export const useSignIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = async (email: string, pass: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, email, pass);
      return true;
    } catch (err: any) {
      console.error("Login Error:", err);
      let errorMessage = "Failed to sign in.";

      // Map Firebase error codes to user-friendly messages
      // Note: Firebase recently consolidated many login errors into 'auth/invalid-credential' for security
      if (
        err.code === "auth/invalid-credential" ||
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password"
      ) {
        errorMessage = "Invalid email or password.";
      } else if (err.code === "auth/too-many-requests") {
        errorMessage = "Too many failed attempts. Please try again later.";
      } else if (err.code === "auth/user-disabled") {
        errorMessage = "This account has been disabled.";
      }

      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { signIn, isLoading, error };
};
