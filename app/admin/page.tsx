"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { deleteDocumentById } from "@/lib/firebaseUtils";
import UsersCard from "@/components/admin/users-card";
import { useCollectionData } from "@/hooks/use-documents";

export default function DashboardPage() {
	const {
		data: fetchedSurveys,
		loading: surveyLoading,
		error,
	} = useCollectionData("surveys");
	const [surveys, setSurveys] = useState<any[]>([]);
	const [walletFilter, setWalletFilter] = useState("all");
	const [dateFilter, setDateFilter] = useState("");
	const [loading, setLoading] = useState(false);

	// Sync Firestore surveys into local state
	useEffect(() => {
		setSurveys(fetchedSurveys);
	}, [fetchedSurveys]);

	// Filter users by wallet and date
	const filteredUsers = surveys.filter((user) => {
		const walletMatch =
			walletFilter === "all" || user.walletProvider === walletFilter;
		const dateMatch =
			!dateFilter || (user.timestamp && user.timestamp.includes(dateFilter));
		return walletMatch && dateMatch;
	});

	// Delete document from Firestore and local state
	const deleteDocument = async (id: string) => {
		setLoading(true);
		try {
			await deleteDocumentById("surveys", id);
			setSurveys((prev) => prev.filter((doc) => doc.id !== id));
			console.log(`Document with id ${id} deleted successfully.`);
		} catch (err: any) {
			console.error("Error deleting document:", err.message);
		} finally {
			setLoading(false);
		}
	};

	const uniqueWallets = Array.from(
		new Set(surveys.map((u) => u.walletProvider))
	);

	// Loading overlay
	if (surveyLoading || loading) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				className="fixed inset-0 bg-black/70 flex flex-col items-center justify-center z-50"
			>
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.3 }}
					className="text-center text-white space-y-4"
				>
					<div className="animate-spin w-10 h-10 border-4 border-white/30 border-t-white rounded-full mx-auto" />
					<p>Loading...</p>
				</motion.div>
			</motion.div>
		);
	}

	// Error state
	if (error) {
		return <p className="text-red-500 text-center mt-10">{error}</p>;
	}

	return (
		<div className="min-h-screen bg-white">
			<main className="p-primary pb-12">
				<div className="max-w-7xl mx-auto">
					{/* Header */}
					<header className="mb-8">
						<h1 className="text-4xl font-outfit font-bold mb-2">
							Admin Dashboard
						</h1>
						<p className="text-black/60">View and filter all user entries</p>
					</header>

					{/* Filters */}
					<section className="mb-6 flex flex-col sm:flex-row gap-4">
						<div className="flex-1">
							<label className="block text-sm font-dm-mono mb-2 text-black/60">
								Filter by Wallet
							</label>
							<Select
								value={walletFilter}
								onValueChange={setWalletFilter}
							>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="All wallets" />
								</SelectTrigger>
								<SelectContent className="text-black bg-white">
									<SelectItem value="all">All Wallets</SelectItem>
									{uniqueWallets.map((wallet) => (
										<SelectItem
											key={wallet}
											value={wallet}
											className="capitalize"
										>
											{wallet}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="flex-1">
							<label className="block text-sm font-dm-mono mb-2 text-black/60">
								Filter by Date
							</label>
							<Input
								type="date"
								value={dateFilter}
								onChange={(e) => setDateFilter(e.target.value)}
								className="w-full"
							/>
						</div>
					</section>

					{/* Results Count */}
					<p className="text-sm font-dm-mono text-black/60 mb-4">
						Showing {filteredUsers.length} of {surveys.length} entries
					</p>

					{/* Users Grid */}
					<section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{filteredUsers.map((user, index) => (
							<UsersCard
								key={index}
								entry={user}
								index={index}
								onDelete={deleteDocument}
							/>
						))}
					</section>

					{/* Empty State */}
					{filteredUsers.length === 0 && (
						<div className="text-center py-12">
							<p className="text-xl text-black/60">
								No entries match your filters
							</p>
						</div>
					)}
				</div>
			</main>
		</div>
	);
}
