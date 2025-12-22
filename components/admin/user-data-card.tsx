"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

interface UserData {
  uid: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

interface UserDataCardProps {
  entry: UserData;
  index: number;
  onEdit: (id: string, updatedData: Partial<UserData>) => Promise<void>;
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
  const [newRole, setNewRole] = useState<UserData['role']>(entry.role);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Handle Save Edit (updating the role)
  const handleSave = async () => {
    await onEdit(entry.uid, { role: newRole });
    setEditing(false);
  };

  const handleConfirmDelete = () => {
    onDelete(entry.uid);
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
          {/* Header: Name and Email */}
          <div className="border-b border-black/20 pb-2">
            <h3 className="font-outfit font-semibold text-lg">
              {entry.name}
            </h3>
            <p className="text-xs text-black/60 font-dm-mono">
              {entry.email}
            </p>
          </div>

          {/* User ID Section */}
          <div className="bg-neutral-50 border border-neutral-300 rounded p-3">
            <label className="text-xs font-dm-mono text-black/60 block mb-1">
              User ID (UID)
            </label>
            <p className="text-xs font-dm-mono break-all">
              {entry.uid}
            </p>
          </div>

          {/* Role Section (Editable) */}
          <div className={`${entry.role === 'admin' ? 'bg-purple-50 border-purple-300' : 'bg-blue-50 border-blue-300'} border rounded p-3`}>
            <label className="text-xs font-dm-mono text-black/60 block mb-1">
              Account Role
            </label>

            {editing ? (
              <div className="flex items-center gap-2">
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as UserData['role'])}
                  className="border border-black/20 rounded px-2 py-1 text-sm bg-white"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                <button
                  onClick={handleSave}
                  className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditing(false);
                    setNewRole(entry.role);
                  }}
                  className="bg-neutral-300 text-black px-3 py-1 rounded text-sm hover:bg-neutral-400 transition"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <p className={`text-sm font-bold uppercase tracking-wider ${entry.role === 'admin' ? 'text-purple-700' : 'text-blue-700'}`}>
                  {entry.role}
                </p>
                <button
                  onClick={() => setEditing(true)}
                  className="text-xs bg-black text-white px-3 py-1 rounded hover:bg-neutral-800 transition"
                >
                  Change Role
                </button>
              </div>
            )}
          </div>

          {/* Delete Button */}
          <div className="pt-3 mt-3 border-t border-black/10 flex justify-end">
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="bg-red-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-red-700 transition-colors"
            >
              Delete User
            </button>
          </div>
        </div>
      </motion.div>

      {/* Delete Confirmation Modal */}
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
              <h4 className="font-outfit font-semibold text-xl text-red-600">
                Confirm Deletion
              </h4>
              <p className="text-sm text-black/80">
                Are you sure you want to delete this user? This action cannot be undone.
              </p>
              <div className="bg-neutral-100 p-3 rounded border border-black/10">
                <p className="font-semibold text-sm">{entry.name}</p>
                <p className="font-dm-mono text-xs text-black/60">{entry.email}</p>
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
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}