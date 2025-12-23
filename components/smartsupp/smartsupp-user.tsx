"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/authstore";

export default function SmartSuppUserTracker() {
  const user = useAuthStore((state) => state.user);


	useEffect(() => {
		if (
			typeof window !== "undefined" &&
			(window as any).smartsupp &&
			user?.uid
		) {
			(window as any).smartsupp("name", user.displayName);
			(window as any).smartsupp("email", user.email);
			(window as any).smartsupp("vars", {
				userId: user.uid,
				username: user.displayName,
			});
		}
	}, [user]);

	return null;
}
