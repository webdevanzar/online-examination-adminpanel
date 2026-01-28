import { useState } from "react";
import {
  Calendar,
  Clock,
  BookOpen,
  Award,
  AlertCircle,
  X,
  Check,
  Edit2,
  ShieldCheck,
  HelpCircle,
} from "lucide-react";
import type { Exam, UpdateExamData } from "../services/exam";
import Modal from "./Modal";

interface UpdateExamPopupProps {
  exam: Exam;
  isOpen: boolean; // Added for Modal consistency
  onClose: () => void;
  onUpdate: (data: UpdateExamData) => void;
}

const UpdateExamPopup = ({
  exam,
  isOpen,
  onClose,
  onUpdate,
}: UpdateExamPopupProps) => {
  const formatDateTimeLocal = (date: Date | string) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const formatDisplayDate = (date: Date | string) => {
    return new Date(date).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const [startTime, setStartTime] = useState(
    formatDateTimeLocal(exam.startTime),
  );
  const [endTime, setEndTime] = useState(formatDateTimeLocal(exam.endTime));
  const [isEditing, setIsEditing] = useState(false);
  const [isPublished, setIsPublished] = useState<boolean>(!!exam.isPublished);
  const [microphoneRequired, setMicrophoneRequired] = useState<boolean>(
    !!exam.microphoneRequired,
  );
  const [faceDetectionRequired, setFaceDetectionRequired] = useState<boolean>(
    !!exam.faceDetectionRequired,
  );

  const hasChanges = () => {
    const originalStart = formatDateTimeLocal(exam.startTime);
    const originalEnd = formatDateTimeLocal(exam.endTime);
    const originalPublished = !!exam.isPublished;
    const originalMicrophone = !!exam.microphoneRequired;
    const originalFaceDetection = !!exam.faceDetectionRequired;
    return (
      startTime !== originalStart ||
      endTime !== originalEnd ||
      isPublished !== originalPublished ||
      microphoneRequired !== originalMicrophone ||
      faceDetectionRequired !== originalFaceDetection
    );
  };

  const handleUpdate = () => {
    if (!hasChanges()) {
      alert("No changes detected");
      return;
    }

    const start = new Date(startTime);
    const end = new Date(endTime);
    const now = new Date();
    const originalStart = new Date(exam.startTime);
    const isStartTimeChanged = start.getTime() !== originalStart.getTime();

    if (isStartTimeChanged && start < now) {
      alert("Start time cannot be in the past");
      return;
    }

    if (end <= start) {
      alert("End time must be after start time");
      return;
    }

    const updateData: UpdateExamData = {
      startTime: startTime,
      endTime: endTime,
      isPublished: isPublished,
      microphoneRequired: microphoneRequired,
      faceDetectionRequired: faceDetectionRequired,
    };

    onUpdate(updateData);
  };

  const toggleEdit = () => {
    if (isEditing) {
      setStartTime(formatDateTimeLocal(exam.startTime));
      setEndTime(formatDateTimeLocal(exam.endTime));
      setIsPublished(!!exam.isPublished);
      setMicrophoneRequired(!!exam.microphoneRequired);
      setFaceDetectionRequired(!!exam.faceDetectionRequired);
    }
    setIsEditing(!isEditing);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Update Exam" size="lg">
      <div className="space-y-8">
        {/* Header Section with Actions */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
              <BookOpen size={24} />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900 leading-tight">
                {exam.title}
              </h4>
              <p className="text-sm text-slate-500 font-medium">
                Subject:{" "}
                <span className="text-blue-600 font-bold">{exam.subject}</span>
              </p>
            </div>
          </div>
          {!isEditing && (
            <button
              onClick={toggleEdit}
              className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl font-bold transition-all flex items-center gap-2 border border-slate-200"
            >
              <Edit2 size={18} />
              Edit Settings
            </button>
          )}
        </div>

        {/* Read Only Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
            <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-wider mb-1">
              <Clock size={14} className="text-blue-500" />
              Duration
            </div>
            <div className="text-lg font-black text-slate-900">
              {exam.duration}m
            </div>
          </div>
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
            <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-wider mb-1">
              <Award size={14} className="text-emerald-500" />
              Total Marks
            </div>
            <div className="text-lg font-black text-slate-900">
              {exam.totalMarks}
            </div>
          </div>
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
            <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-wider mb-1">
              <ShieldCheck size={14} className="text-indigo-500" />
              Pass Score
            </div>
            <div className="text-lg font-black text-slate-900">
              {exam.passingMarks}
            </div>
          </div>
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
            <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-wider mb-1">
              <HelpCircle size={14} className="text-amber-500" />
              Questions
            </div>
            <div className="text-lg font-black text-slate-900">
              {exam.questionCount || 0}
            </div>
          </div>
        </div>

        {/* Configurations Section */}
        <div
          className={`space-y-6 p-6 rounded-3xl border-2 transition-all duration-300 ${
            isEditing
              ? "bg-white border-blue-500/20 shadow-xl shadow-blue-500/5"
              : "bg-slate-50/50 border-slate-100 shadow-none"
          }`}
        >
          <div className="flex items-center gap-3 mb-2">
            <div
              className={`p-2 rounded-xl transition-colors ${isEditing ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-500"}`}
            >
              <Calendar size={20} />
            </div>
            <h4 className="font-black text-slate-900">Schedule & Settings</h4>
          </div>

          {isEditing && (
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex gap-4 animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={20} className="text-amber-600 shrink-0" />
              <p className="text-sm font-bold text-amber-800 leading-relaxed">
                Schedule updates must be in the future. End time must follow
                start time.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">
                Start Time
              </label>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1 leading-none">
                Currently: {formatDisplayDate(exam.startTime)}
              </div>
              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                disabled={!isEditing}
                className={`w-full bg-white border rounded-2xl p-4 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-black text-slate-900 ${
                  isEditing
                    ? "border-blue-200"
                    : "border-slate-200 bg-slate-50 opacity-60"
                }`}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">
                End Time
              </label>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1 leading-none">
                Currently: {formatDisplayDate(exam.endTime)}
              </div>
              <input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                disabled={!isEditing}
                className={`w-full bg-white border rounded-2xl p-4 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-black text-slate-900 ${
                  isEditing
                    ? "border-blue-200"
                    : "border-slate-200 bg-slate-50 opacity-60"
                }`}
              />
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-black text-slate-900 mb-1">
                  Visibility Status
                </label>
                <p className="text-xs font-bold text-slate-500 italic">
                  {isPublished
                    ? "Live: Students can access this exam"
                    : "Draft: Hidden from all candidate lists"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => isEditing && setIsPublished(!isPublished)}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all ${
                  isPublished ? "bg-emerald-500" : "bg-slate-300"
                } ${!isEditing ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:scale-105 active:scale-95"}`}
                disabled={!isEditing}
              >
                <div
                  className={`h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
                    isPublished ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-stretch gap-4 pt-4 border-t border-slate-100">
          {isEditing ? (
            <>
              <button
                onClick={toggleEdit}
                className="flex-1 px-8 py-4 bg-slate-50 text-slate-600 rounded-2xl font-black hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
              >
                <X size={20} />
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={!hasChanges()}
                className={`flex-1 px-8 py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 ${
                  hasChanges()
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 transform hover:scale-[1.02] active:scale-[0.98]"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                }`}
              >
                <Check size={20} />
                Update Exam
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="w-full px-8 py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10"
            >
              Close Details
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default UpdateExamPopup;
