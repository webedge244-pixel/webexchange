"use client";

import { useEffect } from "react";

export default function SmartSuppScript() {
	useEffect(() => {
		if (typeof window === "undefined") return;

		if (window.smartsupp) return;

		const smartsuppKey = process.env.NEXT_PUBLIC_SMARTSUPP_KEY;

		if (!smartsuppKey) {
			console.warn("SmartSupp key is missing from environment variables.");
			return;
		}

		(window as any)._smartsupp = { key: smartsuppKey };
		(window as any).smartsupp = function () {
			(window as any).smartsupp._.push(arguments);
		};
		(window as any).smartsupp._ = [];

		const script = document.createElement("script");
		script.src = "https://www.smartsuppchat.com/loader.js";
		script.async = true;
		script.charset = "utf-8";

		document.body.appendChild(script);
	}, []);

	return null;
}
