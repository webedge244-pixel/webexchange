import { Outfit } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import AdminAuth from "@/components/admin/admin-auth";
import Navbar from "@/components/admin/admin-nav";

// Outfit
const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AdminAuth>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <div>
            <Navbar />
          </div>
          <main className={`${outfit.className} relative pt-28 md:pt-26`}>
            {children}
          </main>
        </TooltipProvider>
      </AdminAuth>
    </>
  );
}
