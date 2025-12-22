"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Equal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase"; // your firebase config
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { useRouter } from "next/navigation";

const navLinks = [
	{ href: "/admin", label: "Dashboard" },
	{ href: "/admin/users", label: "Users" },
	{ href: "/admin/sign-in", label: "Sign In" },
];

export default function Navbar() {
	const [isOpen, setIsOpen] = useState(false);
	const [user, setUser] = useState<User | null>(null);
	const router = useRouter();
	// Listen for auth state changes
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
			setUser(currentUser);
		});
		return unsubscribe;
	}, []);

	const handleSignOut = async () => {
		await signOut(auth);
		router.push("/");
		setIsOpen(false);
	};

	return (
		<>
			{/* Desktop Nav */}
			<nav
				className={cn(
					"fixed top-0 z-50 w-full sc-divider bg-white/80 backdrop-blur-md p-primary hidden md:flex items-center md:gap-10 lg:gap-12 h-14"
				)}
			>
				<div className="flex items-center space-x-6 text-sm font-dm-mono">
					{navLinks.map((link) => {
						// Only show "Sign In" if user is not logged in
						if (link.href === "/sign-in" && user) return null;

						const isActive =
							typeof window !== "undefined" && location.pathname === link.href;
						return (
							<Link
								key={link.href}
								href={link.href}
								className={cn(
									"transition-colors hover:text-black/50 h-full py-4",
									isActive ? "border-b border-black font-medium" : "border-0"
								)}
							>
								{link.label}
							</Link>
						);
					})}

					{/* Show Sign Out if user is logged in */}
					{user && (
						<button
							onClick={handleSignOut}
							className="transition-colors hover:text-black/50 h-full py-4"
						>
							Sign Out
						</button>
					)}
				</div>
			</nav>

			{/* Mobile Top Bar */}
			<nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-6 py-3 md:hidden h-16">
				<Button
					onClick={() => setIsOpen(true)}
					className="flex flex-col items-center ml-auto"
				>
					<Equal className="w-6 h-6" />
				</Button>
			</nav>

			{/* Mobile Menu Overlay */}
			<AnimatePresence>
				{isOpen && (
					<motion.div
						className="fixed inset-0 z-[60] bg-white flex flex-col items-start justify-start p-2 pt-28"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.65 }}
					>
						<button
							onClick={() => setIsOpen(false)}
							className="absolute top-3 right-6 p-2"
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
									transition: { staggerChildren: 0.1 },
								},
							}}
							className="space-y-4 text-start w-full"
						>
							{navLinks.map((link) => {
								if (link.href === "/sign-in" && user) return null;
								return (
									<motion.li
										key={link.href}
										variants={{
											hidden: { opacity: 0, y: 20 },
											visible: { opacity: 1, y: 0 },
										}}
										className="border-b border-black/20 flex items-center w-full pb-4 first:border-t first:pt-4"
									>
										<Link
											href={link.href}
											onClick={() => setIsOpen(false)}
											className="text-2xl font-medium hover:text-primary transition-colors hover:text-black/60"
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
									className="border-b border-black/20 flex items-center w-full pb-4"
								>
									<button
										onClick={handleSignOut}
										className="text-2xl font-medium text-red-700 transition-colors hover:text-red-700/60 hover:underline"
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
