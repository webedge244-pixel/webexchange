// stores/authStore.ts
import { create } from "zustand";
import { auth } from "@/lib/firebase"; // Ensure this path matches your setup
import { onAuthStateChanged, signOut, type User } from "firebase/auth";

type AuthStatus = "IDLE" | "PENDING" | "SUCCESS" | "NO_USER" | "ERROR";

interface AuthState {
  user: User | null;
  status: AuthStatus;
  isAuthenticated: boolean;

  checkUser: () => Promise<void>;
  listenToAuthChanges: () => () => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: "IDLE",
  isAuthenticated: false,

  /**
   * Check current authenticated user (on app load / refresh)
   * Firebase does not have a direct "get" promise like Supabase,
   * so we wrap the listener in a Promise to simulate it.
   */
  checkUser: async () => {
    set({ status: "PENDING" });

    return new Promise<void>((resolve) => {
      // We set up a one-time listener to get the initial state
      const unsubscribe = onAuthStateChanged(
        auth,
        (user) => {
          if (user) {
            set({
              user: user,
              isAuthenticated: true,
              status: "SUCCESS",
            });
          } else {
            set({
              user: null,
              isAuthenticated: false,
              status: "NO_USER",
            });
          }
          unsubscribe(); // Unsubscribe immediately after the first check
          resolve();
        },
        (error) => {
          console.error("Auth check error:", error);
          set({
            user: null,
            isAuthenticated: false,
            status: "ERROR",
          });
          resolve();
        }
      );
    });
  },

  /**
   * Listen to Firebase auth state changes
   * Call once (e.g. in root layout)
   */
  listenToAuthChanges: () => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        set({
          user: user,
          isAuthenticated: true,
          status: "SUCCESS",
        });
      } else {
        set({
          user: null,
          isAuthenticated: false,
          status: "NO_USER",
        });
      }
    });

    // Firebase returns the unsubscribe function directly
    return () => {
      unsubscribe();
    };
  },

  /**
   * Logout
   */
  logout: async () => {
    try {
      await signOut(auth);
      set({
        user: null,
        isAuthenticated: false,
        status: "NO_USER",
      });
    } catch (error) {
      console.error("Logout error:", error);
      set({ status: "ERROR" });
    }
  },
}));
