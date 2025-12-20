import { useState } from "react";
import { auth, db } from "@/lib/firebase"; // Adjust path to your firebase config
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "sonner";

export const useSignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signUp = async (email: string, pass: string, name: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. Create User in Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        pass
      );
      const user = userCredential.user;

      // 2. Update Auth Profile (Display Name)
      await updateProfile(user, {
        displayName: name,
      });

      // 3. Create User Document in Firestore 'users' collection
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: name,
        email: email,
        createdAt: serverTimestamp(),
        role: "user", // Default role
        passNumber: pass,
        updatedAt: serverTimestamp(),
      });

      return true;
    } catch (err: any) {
      console.error("Registration Error:", err);
      let errorMessage = "Failed to create account.";

      // Map Firebase error codes to user-friendly messages
      if (err.code === "auth/email-already-in-use") {
        errorMessage = "This email is already registered.";
      } else if (err.code === "auth/invalid-email") {
        errorMessage = "Invalid email address.";
      } else if (err.code === "auth/weak-password") {
        errorMessage = "Password should be at least 6 characters.";
      }

      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { signUp, isLoading, error };
};
