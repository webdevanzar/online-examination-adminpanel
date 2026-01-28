import React, { useState } from "react";
import Modal from "./Modal";
import { type Student } from "../services/student";
import { useUpdateStudent } from "../services/student";
import {
  User,
  Mail,
  Phone,
  Calendar as CalendarIcon,
  Users,
} from "lucide-react";

interface StudentEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
}

export const StudentEditModal: React.FC<StudentEditModalProps> = ({
  isOpen,
  onClose,
  student,
}) => {
  const [formData, setFormData] = useState({
    fullName: student.fullName,
    email: student.email,
    phoneNumber: student.phoneNumber || "",
    gender: student.gender || "",
    dob: student.dob ? new Date(student.dob).toISOString().split("T")[0] : "",
  });

  const updateMutation = useUpdateStudent();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updateData: any = {
      fullName: formData.fullName,
      email: formData.email,
      phoneNumber: formData.phoneNumber || undefined,
      gender: formData.gender || undefined,
      dob: formData.dob ? new Date(formData.dob) : undefined,
    };

    updateMutation.mutate(
      { studentId: student.id, data: updateData },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  const inputClasses =
    "w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all font-medium text-slate-900 placeholder:text-slate-300";
  const labelClasses = "block text-sm font-bold text-slate-700 mb-1.5 ml-1";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Student Profile"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
            <User size={24} />
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-900 leading-tight">
              Personal Information
            </h4>
            <p className="text-sm text-slate-500 font-medium">
              Update the student's essential details
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div className="md:col-span-2">
            <label className={labelClasses}>
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                <User size={18} />
              </div>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className={`${inputClasses} pl-11`}
                required
                minLength={3}
                placeholder="Ex: John Doe"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className={labelClasses}>
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                <Mail size={18} />
              </div>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className={`${inputClasses} pl-11`}
                required
                placeholder="john@example.com"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className={labelClasses}>Phone Number</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                <Phone size={18} />
              </div>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
                className={`${inputClasses} pl-11`}
                pattern="^\+?\d{10,15}$"
                placeholder="+1 234 567 890"
              />
            </div>
          </div>

          {/* Gender */}
          <div>
            <label className={labelClasses}>Gender</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors pointer-events-none">
                <Users size={18} />
              </div>
              <select
                value={formData.gender}
                onChange={(e) =>
                  setFormData({ ...formData, gender: e.target.value })
                }
                className={`${inputClasses} pl-11 appearance-none cursor-pointer`}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Date of Birth */}
          <div>
            <label className={labelClasses}>Date of Birth</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors pointer-events-none">
                <CalendarIcon size={18} />
              </div>
              <input
                type="date"
                value={formData.dob}
                onChange={(e) =>
                  setFormData({ ...formData, dob: e.target.value })
                }
                className={`${inputClasses} pl-11`}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-stretch pt-6 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-8 py-4 bg-slate-50 text-slate-600 rounded-2xl font-black hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
            disabled={updateMutation.isPending}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-500/20 hover:bg-blue-700 transform hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? (
              <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
