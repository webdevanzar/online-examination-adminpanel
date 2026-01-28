import React from "react";
import Modal from "./Modal";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface ActivateConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  isLoading?: boolean;
}

export const ActivateConfirmationModal: React.FC<
  ActivateConfirmationModalProps
> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Activate",
  isLoading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-6">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner">
            <CheckCircle2 size={32} />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2 text-emerald-600">
              <AlertCircle size={16} />
              <span className="text-xs font-black uppercase tracking-widest">
                Confirmation Required
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
            className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? "Activating..." : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};
