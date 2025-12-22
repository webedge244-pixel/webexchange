import { auth } from "@/lib/firebase"; // Client SDK
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export const useLogout = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const logout = async () => {
    setIsLoggingOut(true);
    try {
      // 1. Sign out from Firebase Client (Removes token from memory)
      await signOut(auth);

      // 2. Clear the Server Cookie via your API DELETE method
      const response = await fetch("/api/auth/session", { 
        method: "DELETE" 
      });

      if (!response.ok) throw new Error("Failed to clear server session");

      toast.success("Logged out successfully");

      // 3. Force a refresh and redirect
      // router.refresh() forces Middleware to re-evaluate the request
      router.refresh();
      router.push("/"); 
      
    } catch (error) {
      console.error("Logout Error:", error);
      toast.error("Error logging out. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return { logout, isLoggingOut };
};