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
import { deleteDocumentById, updateDocumentById } from "@/lib/firebaseUtils";
import UserDataCard from "@/components/admin/user-data-card";
import { useCollectionData } from "@/hooks/use-documents";

export default function UsersPage() {
  const {
    data: fetchedUsers,
    loading: usersLoading,
    error,
  } = useCollectionData("users");

  const [users, setUsers] = useState<any[]>([]);
  const [walletFilter, setWalletFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (fetchedUsers) {
      const sortedUsers = [...fetchedUsers].sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA;
      });
      setUsers(sortedUsers);
    }
  }, [fetchedUsers]);

  const filteredUsers = users.filter((user) => {
    const walletMatch =
      walletFilter === "all" || user.walletProvider === walletFilter;

    let dateMatch = true;
    if (dateFilter) {
      if (!user.createdAt) {
        dateMatch = false;
      } else {
        const userDate = new Date(user.createdAt)
          .toISOString()
          .split("T")[0];
        dateMatch = userDate === dateFilter;
      }
    }

    return walletMatch && dateMatch;
  });

  const deleteUser = async (id: string) => {
    setLoading(true);
    try {
      await deleteDocumentById("users", id);
      setUsers((prev) => prev.filter((doc) => doc.id !== id));
    } finally {
      setLoading(false);
    }
  };


  const uniqueWallets = Array.from(new Set(users.map((u) => u.walletProvider)));

  // 🌌 Loading Overlay (match wallet flow)
  if (usersLoading || loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-background/80 backdrop-blur-md flex items-center justify-center z-50"
      >
        <div className="glass-card p-8 flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">
            Loading users…
          </p>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <p className="text-destructive text-center mt-10">
        {error}
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <main className="relative z-10 px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="mb-10">
            <h1 className="font-orbitron font-bold text-3xl mb-2">
              User Management
            </h1>
            <p className="text-muted-foreground max-w-xl">
              View, edit allocations, and manage all registered users.
            </p>
          </header>

          {/* Filters */}
          <section className="glass-card p-6 mb-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono text-muted-foreground mb-2">
                Wallet Provider
              </label>
              <Select value={walletFilter} onValueChange={setWalletFilter}>
                <SelectTrigger className="input-glow">
                  <SelectValue placeholder="All wallets" />
                </SelectTrigger>
                <SelectContent>
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
              <label className="block text-xs font-mono text-muted-foreground mb-2">
                Created Date
              </label>
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="input-glow"
              />
            </div>
          </section>

          {/* Results Count */}
          <p className="text-xs font-mono text-muted-foreground mb-6">
            Showing {filteredUsers.length} of {users.length} users
          </p>

          {/* Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user, index) => (
              <UserDataCard
                key={user.id || index}
                entry={user}
                index={index}
              />
            ))}
          </section>

          {/* Empty */}
          {filteredUsers.length === 0 && (
            <div className="glass-card p-12 mt-12 text-center">
              <p className="text-muted-foreground">
                No users match your current filters.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
