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

  useEffect(() => {
    setSurveys(fetchedSurveys);
  }, [fetchedSurveys]);

  const filteredUsers = surveys.filter((user) => {
    const walletMatch =
      walletFilter === "all" || user.walletProvider === walletFilter;
    const dateMatch =
      !dateFilter || (user.timestamp && user.timestamp.includes(dateFilter));
    return walletMatch && dateMatch;
  });

  const deleteDocument = async (id: string) => {
    setLoading(true);
    try {
      await deleteDocumentById("surveys", id);
      setSurveys((prev) => prev.filter((doc) => doc.id !== id));
    } finally {
      setLoading(false);
    }
  };

  const uniqueWallets = Array.from(
    new Set(surveys.map((u) => u.walletProvider))
  );

  /* ---------------- Loading Overlay ---------------- */
  if (surveyLoading || loading) {
    return (
      <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur flex items-center justify-center">
        <div className="glass-card p-8 text-center space-y-4">
          <div className="w-10 h-10 mx-auto rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-destructive text-center mt-20">{error}</p>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 blur-3xl rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/5 blur-3xl rounded-full" />
      </div>

      <main className="relative z-10 container py-12">
        {/* Header */}
        <header className="mb-10">
          <h1 className="font-orbitron font-bold text-3xl md:text-4xl mb-2">
            Admin <span className="text-primary text-glow-blue">Dashboard</span>
          </h1>
          <p className="text-muted-foreground">
            View, filter, and manage all user survey entries
          </p>
        </header>

        {/* Filters */}
        <section className="glass-card p-6 mb-8 grid gap-6 md:grid-cols-2">
          <div>
            <label className="block text-sm text-muted-foreground mb-2">
              Filter by Wallet
            </label>
            <Select value={walletFilter} onValueChange={setWalletFilter}>
              <SelectTrigger className="bg-input border-border input-glow">
                <SelectValue placeholder="All wallets" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
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

          <div>
            <label className="block text-sm text-muted-foreground mb-2">
              Filter by Date
            </label>
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-input border-border input-glow"
            />
          </div>
        </section>

        {/* Results Count */}
        <p className="text-sm text-muted-foreground mb-6">
          Showing{" "}
          <span className="text-primary font-semibold">
            {filteredUsers.length}
          </span>{" "}
          of {surveys.length} entries
        </p>

        {/* Users Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              No entries match your current filters
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
