"use client";

import { motion } from "motion/react";
import { User, Mail, Hash, Calendar } from "lucide-react";

interface UserData {
  uid: string;
  email: string;
  name: string;
  passNumber: string;
  createdAt: any;
}

interface UserDataCardProps {
  entry: UserData;
  index: number;
}

export default function UserDataCard({ entry, index }: UserDataCardProps) {
  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A";
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
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="relative overflow-hidden glass-card p-6 group hover:neon-border-blue transition-all duration-500"
    >
      {/* 🔮 Ambient Background Accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-64 h-64 bg-primary/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Content */}
      <div className="relative z-10 space-y-5">
        {/* Header */}
        <div className="pb-4 border-b border-border/40">
          <h3 className="font-orbitron font-semibold text-lg">
            {entry.name}
          </h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <Mail className="w-4 h-4" />
            {entry.email}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-4">
          {/* Pass Number */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Hash className="w-4 h-4" />
              Pass Number
            </div>
            <span className="font-mono text-sm text-primary font-semibold">
              {entry.passNumber || "N/A"}
            </span>
          </div>

          {/* UID */}
          <div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <User className="w-4 h-4" />
              User ID
            </div>
            <p className="font-mono text-xs break-all text-muted-foreground">
              {entry.uid}
            </p>
          </div>

          {/* Created At */}
          <div className="pt-3 mt-3 border-t border-border/40 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="w-4 h-4" />
              Member Since
            </div>
            <span className="text-xs text-muted-foreground">
              {formatDate(entry.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
