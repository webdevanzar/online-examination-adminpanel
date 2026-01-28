import React, { useState } from "react";
import Modal from "./Modal";
import { useResetStudentPassword } from "../services/student";
import { toast } from "sonner";
import { Key, Eye, EyeOff, AlertCircle } from "lucide-react";

interface PasswordResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: string;
  studentName: string;
}

export const PasswordResetModal: React.FC<PasswordResetModalProps> = ({
  isOpen,
  onClose,
  studentId,
  studentName,
}) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const resetMutation = useResetStudentPassword();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    resetMutation.mutate(
      { studentId, data: { newPassword } },
      {
        onSuccess: () => {
          setNewPassword("");
          setConfirmPassword("");
          onClose();
        },
      },
    );
  };

  const handleClose = () => {
    setNewPassword("");
    setConfirmPassword("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Reset Password`}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
            <Key size={24} />
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-900 leading-tight">
              {studentName}
            </h4>
            <p className="text-sm text-slate-500 font-medium">
              Resetting access credentials
            </p>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex gap-3">
          <AlertCircle className="text-blue-500 shrink-0" size={20} />
          <p className="text-sm text-slate-600 font-medium leading-relaxed">
            Must be 8-32 characters with at least one uppercase, one lowercase,
            and one number.
          </p>
        </div>

        <div className="space-y-4">
          {/* New Password */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">
              New Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all font-medium"
                placeholder="••••••••"
                required
                minLength={8}
                maxLength={32}
                pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,32}$"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all font-medium"
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-stretch pt-2">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 px-6 py-3 text-slate-600 bg-slate-50 rounded-2xl font-bold hover:bg-slate-100 transition-all duration-200"
            disabled={resetMutation.isPending}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all duration-200 disabled:opacity-50"
            disabled={resetMutation.isPending}
          >
            {resetMutation.isPending ? "Resetting..." : "Update Password"}
          </button>
        </div>
      </form>
    </Modal>
  );
};
