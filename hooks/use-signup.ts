import { useState } from "react";
import { auth, db } from "@/lib/firebase"; 
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "sonner";
import { useRouter } from "next/navigation"; // Added for navigation

export const useSignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const signUp = async (email: string, pass: string, name: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. Create User in Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      const user = userCredential.user;

      // 2. Update Auth Profile (Display Name)
      await updateProfile(user, { displayName: name });

      // 3. Create User Document in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: name,
        email: email,
        createdAt: serverTimestamp(),
        role: "user",
        passNumber: pass, // Note: Storing plain text passwords is generally discouraged for security
        updatedAt: serverTimestamp(),
      });

      // 4. GENERATE SESSION COOKIE
      // We get the ID token from the newly created user
      const idToken = await user.getIdToken();

      // Send it to your refactored API route
      const response = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        throw new Error("Failed to initialize server session.");
      }

      toast.success("Account created successfully!");
      
      // 5. Finalize
      // router.refresh ensures the middleware sees the new cookie immediately
      router.refresh();
      router.push("/connect-wallet"); // Redirect to one of your protected routes
      
      return true;
    } catch (err: any) {
      console.error("Registration Error:", err);
      let errorMessage = "Failed to create account.";

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