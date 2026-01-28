import React from "react";
import Modal from "./Modal";
import { Trash2, AlertCircle } from "lucide-react";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  isLoading?: boolean;
}

export const DeleteConfirmationModal: React.FC<
  DeleteConfirmationModalProps
> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Delete",
  isLoading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-6">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shadow-inner">
            <Trash2 size={32} />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2 text-red-600">
              <AlertCircle size={16} />
              <span className="text-xs font-black uppercase tracking-widest">
                Dangerous Action
              </span>
            </div>
            <p className="text-slate-600 font-medium">{message}</p>
          </div>
        </div>

        <div className="flex gap-3 justify-stretch pt-2">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 text-slate-600 bg-slate-50 rounded-2xl font-bold hover:bg-slate-100 transition-all duration-200"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-6 py-3 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 hover:shadow-lg hover:shadow-red-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};
