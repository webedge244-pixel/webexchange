// app/providers.tsx
"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthProvider from "./auth-provider";
import SmartSuppScript from "@/components/smartsupp/smartsupp-script";
import SmartSuppUserTracker from "@/components/smartsupp/smartsupp-user";
const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          {children}
          <SmartSuppScript /> {/* Loads the widget */}
				<SmartSuppUserTracker /> {/* Sends user info */}
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
