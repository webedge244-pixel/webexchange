"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

interface UserData {
  id: string;
  cardanoBalance: number;
  allocationAmount: number;
  blockchainNetwork: string;
  walletProvider: string;
  destinationAddress: string;
}

interface UserDataCardProps {
  entry: UserData;
  index: number;
  onEdit: (id: string, newAmount: number) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function UserDataCard({
  entry,
  index,
  onEdit,
  onDelete,
}: UserDataCardProps) {
  const isEven = index % 2 === 0;
  const [editing, setEditing] = useState(false);
  const [newAllocation, setNewAllocation] = useState(entry.allocationAmount);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // ✅ Handle Save Edit
  const handleSave = () => {
    onEdit(entry.id, newAllocation);
    setEditing(false);
  };

  const handleConfirmDelete = () => {
    onDelete(entry.id);
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className={`border border-black rounded-sm p-4 hover:shadow-lg transition-shadow ${
          isEven ? "bg-neutral-100" : "bg-white"
        }`}
      >
        <div className="space-y-3">
          {/* Header */}
          <div className="border-b border-black/20 pb-2">
            <h3 className="font-outfit font-semibold text-lg capitalize">
              {entry.walletProvider}
            </h3>
            <p className="text-xs text-black/60 font-dm-mono">
              {entry.blockchainNetwork}
            </p>
          </div>

          {/* ✅ Cardano Balance */}
          <div className="bg-green-50 border border-green-300 rounded p-3">
            <label className="text-xs font-dm-mono text-black/60 block mb-1">
              Cardano Balance
            </label>
            <p className="text-lg font-bold font-dm-mono text-green-700">
              {entry.cardanoBalance.toLocaleString()}
            </p>
          </div>

          {/* ✅ Allocation Amount (Editable) */}
          <div className="bg-blue-50 border border-blue-300 rounded p-3">
            <label className="text-xs font-dm-mono text-black/60 block mb-1">
              Allocation Amount
            </label>

            {editing ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={newAllocation}
                  onChange={(e) => setNewAllocation(Number(e.target.value))}
                  className="border border-black/20 rounded px-2 py-1 text-sm w-28"
                />
                <button
                  onClick={handleSave}
                  className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditing(false);
                    setNewAllocation(entry.allocationAmount);
                  }}
                  className="bg-neutral-300 text-black px-3 py-1 rounded text-sm hover:bg-neutral-400 transition"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <p className="text-base font-dm-mono">
                  ₳ {entry.allocationAmount.toLocaleString()}
                </p>
                <button
                  onClick={() => setEditing(true)}
                  className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                >
                  Edit
                </button>
              </div>
            )}
          </div>

          {/* ✅ Destination Address (Main Focus) */}
          <div>
            <label className="text-xs font-dm-mono text-black/60 block mb-1">
              Destination Address
            </label>
            <p className="text-xs font-dm-mono break-all bg-white/50 p-2 rounded border border-black/10">
              {entry.destinationAddress}
            </p>
          </div>

          {/* ✅ Delete Button */}
          <div className="pt-3 mt-3 border-t border-black/10 flex justify-end">
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="bg-red-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </motion.div>

      {/* ✅ Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-sm border border-black p-6 w-full max-w-md space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h4 className="font-outfit font-semibold text-xl">
                Confirm Deletion
              </h4>
              <p className="text-sm text-black/80">
                Are you sure you want to delete this user entry?
              </p>
              <div className="bg-neutral-100 p-3 rounded border border-black/10">
                <p className="font-dm-mono text-xs text-black/60">
                  Destination Address:
                </p>
                <p className="text-xs font-dm-mono break-all">
                  {entry.destinationAddress}
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-black/10">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="bg-neutral-200 text-black px-4 py-2 rounded text-sm font-medium hover:bg-neutral-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="bg-red-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
