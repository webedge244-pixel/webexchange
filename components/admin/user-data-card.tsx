"use client";

import { motion } from "motion/react";

interface UserData {
  uid: string;
  email: string;
  name: string;
  passNumber: string; // Added field
  createdAt: any;    // Firebase Timestamp object
}

interface UserDataCardProps {
  entry: UserData;
  index: number;
}

export default function UserDataCard({ entry, index }: UserDataCardProps) {
  // Utility to format Firebase Timestamp to String
  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A";
    // Check if it's a Firebase Timestamp with toDate() method
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="border border-black rounded-sm p-5 bg-white hover:shadow-md transition-shadow"
    >
      <div className="space-y-4">
        {/* Header: Primary Info */}
        <div className="border-b border-black/10 pb-3">
          <h3 className="font-outfit font-bold text-xl text-black">
            {entry.name}
          </h3>
          <p className="text-sm text-black/60 font-medium">
            {entry.email}
          </p>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 gap-3">
          {/* Pass Number Section */}
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-black/40 font-bold">
              Pass Number
            </span>
            <span className="font-dm-mono text-sm font-semibold text-blue-600">
              {entry.passNumber || "N/A"}
            </span>
          </div>

          {/* UID Section */}
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-black/40 font-bold">
              User ID (UID)
            </span>
            <span className="font-dm-mono text-[11px] break-all text-black/70">
              {entry.uid}
            </span>
          </div>

          {/* Created At Section */}
          <div className="pt-2 border-t border-black/5 flex justify-between items-center">
            <span className="text-[10px] uppercase tracking-widest text-black/40 font-bold">
              Member Since
            </span>
            <span className="text-xs font-medium text-black/80">
              {formatDate(entry.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}