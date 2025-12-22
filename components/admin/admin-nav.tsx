"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Equal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authstore";
import { useLogout } from "@/hooks/use-logout";
const navLinks = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/users", label: "Users" },
  { href: "/auth/sign-in", label: "Sign In" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
const { logout, isLoggingOut } = useLogout();
  const handleSignOut = async () => {
    await logout();
    router.push("/");
    setIsOpen(false);
  };

  return (
    <>
      {/* Desktop Nav */}
      <nav
        className={cn(
          "fixed top-0 z-50 w-full h-14 hidden md:flex items-center",
          "glass-nav px-primary border-b border-border/40"
        )}
      >
        <div className="flex items-center gap-10 font-mono text-sm">
          {navLinks.map((link) => {
            if (link.href === "/auth/sign-in" && user) return null;

            const isActive =
              typeof window !== "undefined" &&
              location.pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative py-2 transition-colors",
                  "text-muted-foreground hover:text-foreground",
                  isActive &&
                    "text-foreground after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:bg-primary"
                )}
              >
                {link.label}
              </Link>
            );
          })}

          {user && (
            <button
              onClick={handleSignOut}
              className="text-muted-foreground hover:text-red-400 transition-colors"
            >
              Sign Out
            </button>
          )}
        </div>
      </nav>

      {/* Mobile Top Bar */}
      <nav className="fixed top-0 inset-x-0 z-50 h-16 md:hidden flex items-center justify-between px-6 backdrop-blur-md border-b border-border/40">
        <span className="font-orbitron text-sm tracking-wide">
          ADMIN
        </span>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(true)}
          className="hover:bg-white/10"
        >
          <Equal className="w-6 h-6" />
        </Button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-xl"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 p-2 hover:opacity-70"
            >
              <X className="w-6 h-6" />
            </button>

            <motion.ul
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { staggerChildren: 0.08 },
                },
              }}
              className="pt-28 px-6 space-y-6"
            >
              {navLinks.map((link) => {
                if (link.href === "/auth/sign-in" && user) return null;

                return (
                  <motion.li
                    key={link.href}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="block text-2xl font-orbitron tracking-wide text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                );
              })}

              {user && (
                <motion.li
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <button
                    onClick={handleSignOut}
                    className="text-2xl font-orbitron tracking-wide text-red-500 hover:text-red-400 transition-colors"
                  >
                    Sign Out
                  </button>
                </motion.li>
              )}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
