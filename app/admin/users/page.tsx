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

  // 🔄 Sync Firestore users into local state AND Sort by Latest
  useEffect(() => {
    if (fetchedUsers) {
      // Create a copy and sort it
      const sortedUsers = [...fetchedUsers].sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        // b - a sorts descending (Newest first)
        return dateB - dateA;
      });
      setUsers(sortedUsers);
    }
  }, [fetchedUsers]);

  // 🧮 Filter users by wallet and date (using createdAt)
  const filteredUsers = users.filter((user) => {
    const walletMatch =
      walletFilter === "all" || user.walletProvider === walletFilter;

    // Check if user has a createdAt field and match it against the filter
    let dateMatch = true;
    if (dateFilter) {
      if (!user.createdAt) {
        dateMatch = false;
      } else {
        // Convert createdAt to YYYY-MM-DD string to compare with input
        const userDate = new Date(user.createdAt).toISOString().split("T")[0];
        dateMatch = userDate === dateFilter;
      }
    }

    return walletMatch && dateMatch;
  });

  // ❌ Delete user
  const deleteUser = async (id: string) => {
    setLoading(true);
    try {
      await deleteDocumentById("users", id);
      setUsers((prev) => prev.filter((doc) => doc.id !== id));
      console.log(`✅ User with id ${id} deleted successfully.`);
    } catch (err: any) {
      console.error("Error deleting user:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✏️ Edit allocation amount
  const handleEditAllocation = async (id: string, newAmount: number) => {
    setLoading(true);
    try {
      await updateDocumentById("users", id, { allocationAmount: newAmount });

      setUsers((prev) =>
        prev.map((user) =>
          user.id === id ? { ...user, allocationAmount: newAmount } : user
        )
      );
      console.log(`✅ Allocation updated for user with id ${id}`);
    } catch (err: any) {
      console.error("Error updating allocation:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const uniqueWallets = Array.from(new Set(users.map((u) => u.walletProvider)));

  // 🌀 Loading overlay
  if (usersLoading || loading) {
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

  // ⚠️ Error state
  if (error) {
    return <p className="text-red-500 text-center mt-10">{error}</p>;
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="p-primary pb-12">
        <div className="max-w-7xl mx-auto">
          {/* 🧭 Header */}
          <header className="mb-8">
            <h1 className="text-4xl font-outfit font-bold mb-2">
              User Management
            </h1>
            <p className="text-black/60">
              View, edit allocations, and manage all user entries
            </p>
          </header>

          {/* 🔍 Filters */}
          <section className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-dm-mono mb-2 text-black/60">
                Filter by Wallet
              </label>
              <Select value={walletFilter} onValueChange={setWalletFilter}>
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

          {/* 🧾 Results Count */}
          <p className="text-sm font-dm-mono text-black/60 mb-4">
            Showing {filteredUsers.length} of {users.length} entries
          </p>

          {/* 👥 User Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUsers.map((user, index) => (
              <UserDataCard
                key={user.id || index}
                entry={user}
                index={index}
                onEdit={handleEditAllocation}
                onDelete={deleteUser}
              />
            ))}
          </section>

          {/* 🪶 Empty State */}
          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-black/60">
                No users match your filters
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
