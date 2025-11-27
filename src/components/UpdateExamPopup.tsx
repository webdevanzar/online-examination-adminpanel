import { useState } from "react";
import { Calendar, Clock, BookOpen, Award, Mic, Camera, AlertCircle, X, Check, Edit2 } from "lucide-react";
import type { Exam, UpdateExamData } from "../services/exam";

interface UpdateExamPopupProps {
  exam: Exam;
  onClose: () => void;
  onUpdate: (data: UpdateExamData) => void;
}

const UpdateExamPopup = ({ exam, onClose, onUpdate }: UpdateExamPopupProps) => {
  // Format date for datetime-local input (YYYY-MM-DDTHH:mm)
  const formatDateTimeLocal = (date: Date | string) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Format date for display
  const formatDisplayDate = (date: Date | string) => {
    return new Date(date).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  const [startTime, setStartTime] = useState(formatDateTimeLocal(exam.startTime));
  const [endTime, setEndTime] = useState(formatDateTimeLocal(exam.endTime));
  const [isEditing, setIsEditing] = useState(false);
  const [isPublished, setIsPublished] = useState<boolean>(!!exam.isPublished);

  // Check if any changes were made
  const hasChanges = () => {
    const originalStart = formatDateTimeLocal(exam.startTime);
    const originalEnd = formatDateTimeLocal(exam.endTime);
    const originalPublished = !!exam.isPublished;
    return startTime !== originalStart || endTime !== originalEnd || isPublished !== originalPublished;
  };

  const handleUpdate = () => {
    // Check if there are any changes
    if (!hasChanges()) {
      alert("No changes detected");
      return;
    }

    // Validation
    const start = new Date(startTime);
    const end = new Date(endTime);
    const now = new Date();

    // Only validate start time is in future if it's being changed to a different time
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
    };

    onUpdate(updateData);
  };

  const toggleEdit = () => {
    if (isEditing) {
      // Reset to original values when canceling edit
      setStartTime(formatDateTimeLocal(exam.startTime));
      setEndTime(formatDateTimeLocal(exam.endTime));
      setIsPublished(!!exam.isPublished);
    }
    setIsEditing(!isEditing);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto scrollbar-hide">
        {/* Header */}
        <div className="sticky top-0 bg-linear-to-r from-blue-600 to-blue-700 text-white px-6 py-5 rounded-t-2xl flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Update Exam Schedule</h2>
            <p className="text-blue-100 text-sm mt-1">Modify exam start and end times</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Exam Information - Read Only */}
          <div className="bg-linear-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <BookOpen size={20} className="text-blue-600" />
              Exam Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Title */}
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Title</label>
                <p className="text-gray-900 font-semibold mt-1">{exam.title}</p>
              </div>

              {/* Subject */}
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Subject</label>
                <p className="text-gray-900 font-semibold mt-1">{exam.subject}</p>
              </div>

              {/* Duration */}
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Duration</label>
                <p className="text-gray-900 font-semibold mt-1 flex items-center gap-2">
                  <Clock size={16} className="text-blue-600" />
                  {exam.duration} minutes
                </p>
              </div>

              {/* Total Marks */}
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Marks</label>
                <p className="text-gray-900 font-semibold mt-1 flex items-center gap-2">
                  <Award size={16} className="text-green-600" />
                  {exam.totalMarks} marks
                </p>
              </div>

              {/* Passing Marks */}
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Passing Marks</label>
                <p className="text-gray-900 font-semibold mt-1">{exam.passingMarks} marks</p>
              </div>

              {/* Questions */}
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Questions</label>
                <p className="text-gray-900 font-semibold mt-1">{exam.questionCount || 0} questions</p>
              </div>

              {/* Publish Toggle */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Publish Exam
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => isEditing && setIsPublished((v) => !v)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      isPublished ? 'bg-green-600' : 'bg-gray-300'
                    } ${!isEditing ? 'opacity-60 cursor-not-allowed' : ''}`}
                    aria-pressed={isPublished}
                    aria-label="Toggle publish"
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isPublished ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <span className="text-sm text-gray-700">
                    {isPublished ? 'Published (students can see this exam)' : 'Unpublished (hidden from students)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            {exam.description && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Description</label>
                <p className="text-gray-700 mt-1 text-sm">{exam.description}</p>
              </div>
            )}

            {/* Instructions */}
            {exam.instructions && (
              <div className="mt-4">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Instructions</label>
                <p className="text-gray-700 mt-1 text-sm">{exam.instructions}</p>
              </div>
            )}

            {/* Proctoring Settings */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">Proctoring Settings</label>
              <div className="flex flex-wrap gap-3">
                <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                  exam.microphoneRequired
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  <Mic size={14} />
                  Microphone {exam.microphoneRequired ? 'Required' : 'Not Required'}
                </span>
                <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                  exam.faceDetectionRequired
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  <Camera size={14} />
                  Face Detection {exam.faceDetectionRequired ? 'Required' : 'Not Required'}
                </span>
              </div>
            </div>
          </div>

          {/* Editable Time Section */}
          <div className={`bg-white rounded-xl p-5 border-2 shadow-sm transition-all ${
            isEditing ? 'border-blue-400 shadow-blue-100' : 'border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Calendar size={20} className="text-blue-600" />
                Update Exam Schedule
              </h3>
              {!isEditing && (
                <button
                  onClick={toggleEdit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
                >
                  <Edit2 size={16} />
                  Edit Schedule
                </button>
              )}
            </div>

            {/* Alert - Only show in edit mode */}
            {isEditing && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4 flex gap-3">
                <AlertCircle size={20} className="text-yellow-600 shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium">Important:</p>
                  <p className="mt-1">Only exam schedule can be updated. Start time must be in the future and end time must be after start time.</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Start Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  <div className="text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-md">
                    Current: <span className="font-medium text-gray-700">{formatDisplayDate(exam.startTime)}</span>
                  </div>
                  <input
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2.5 border-2 rounded-lg outline-none transition-all text-gray-900 font-medium ${
                      isEditing
                        ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white'
                        : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                    }`}
                  />
                </div>
              </div>

              {/* End Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Time <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  <div className="text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-md">
                    Current: <span className="font-medium text-gray-700">{formatDisplayDate(exam.endTime)}</span>
                  </div>
                  <input
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2.5 border-2 rounded-lg outline-none transition-all text-gray-900 font-medium ${
                      isEditing
                        ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white'
                        : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* New Schedule Preview - Only show when editing and changes exist */}
            {isEditing && hasChanges() && (
              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm font-medium text-blue-900 mb-2">New Schedule Preview:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-blue-800">
                    <Calendar size={16} />
                    <span className="font-medium">Start:</span>
                    <span>{formatDisplayDate(startTime)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-800">
                    <Calendar size={16} />
                    <span className="font-medium">End:</span>
                    <span>{formatDisplayDate(endTime)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 rounded-b-2xl flex justify-end gap-3 border-t border-gray-200">
          {isEditing ? (
            <>
              <button
                onClick={toggleEdit}
                className="px-6 py-2.5 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center gap-2"
              >
                <X size={18} />
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={!hasChanges()}
                className={`px-6 py-2.5 rounded-lg transition-colors font-medium flex items-center gap-2 ${
                  hasChanges()
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/30'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Check size={18} />
                Save Changes
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdateExamPopup;
