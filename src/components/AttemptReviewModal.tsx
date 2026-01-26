import React, { useMemo, useState } from "react";
import Modal from "./Modal";
import type { AttemptReviewResponse } from "../services/attempt";

type DraftMarks = Record<string, string>; // questionId -> "" | number string

type Props = {
  isOpen: boolean;
  onClose: () => void;
  data?: AttemptReviewResponse;
  isLoading?: boolean;
  isError?: boolean;
  onSave: (
    answers: Array<{ questionId: string; marksObtained: number }>,
  ) => void;
  isSaving?: boolean;
};

export const AttemptReviewModal: React.FC<Props> = ({
  isOpen,
  onClose,
  data,
  isLoading = false,
  isError = false,
  onSave,
  isSaving = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Review Answers" size="full">
      {isLoading ? (
        <div className="p-6 text-sm text-gray-600">
          Loading attempt review...
        </div>
      ) : isError ? (
        <div className="p-6 text-sm text-red-700">
          Failed to load answers. Please try again.
        </div>
      ) : !data ? (
        <div className="p-6 text-sm text-gray-600">No data.</div>
      ) : (
        <AttemptReviewEditor
          key={data.attempt.id}
          data={data}
          onClose={onClose}
          onSave={onSave}
          isSaving={isSaving}
        />
      )}
    </Modal>
  );
};

const AttemptReviewEditor: React.FC<{
  data: AttemptReviewResponse;
  onClose: () => void;
  onSave: (
    answers: Array<{ questionId: string; marksObtained: number }>,
  ) => void;
  isSaving: boolean;
}> = ({ data, onClose, onSave, isSaving }) => {
  const [editMode, setEditMode] = useState(false);

  const initialMarks = useMemo<DraftMarks>(() => {
    const next: DraftMarks = {};
    for (const q of data.questions) {
      const v = q.marksObtained;
      next[q.questionId] = typeof v === "number" && v > 0 ? String(v) : "";
    }
    return next;
  }, [data.questions]);

  const [draftMarks, setDraftMarks] = useState<DraftMarks>(initialMarks);

  const isDirty = useMemo(() => {
    const keys = new Set([
      ...Object.keys(initialMarks),
      ...Object.keys(draftMarks),
    ]);
    for (const k of keys) {
      if ((initialMarks[k] ?? "") !== (draftMarks[k] ?? "")) return true;
    }
    return false;
  }, [initialMarks, draftMarks]);

  const totalDraft = useMemo(() => {
    return data.questions.reduce((sum, q) => {
      const raw = draftMarks[q.questionId] ?? "";
      const n = raw === "" ? 0 : Number(raw);
      return sum + (Number.isFinite(n) ? n : 0);
    }, 0);
  }, [data.questions, draftMarks]);

  const handleSave = () => {
    const answers = data.questions.map((q) => {
      const raw = draftMarks[q.questionId] ?? "";
      const n = raw === "" ? 0 : Number(raw);
      return {
        questionId: q.questionId,
        marksObtained: Number.isFinite(n) ? n : 0,
      };
    });
    onSave(answers);
  };

  const headerSubtitle = `${data.attempt.student.fullName} • ${data.attempt.exam.title}`;

  return (
    <>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <p className="text-sm text-gray-600">{headerSubtitle}</p>
          <p className="text-xs text-gray-500 mt-1">
            {editMode ? "Edit mode is ON" : "Read-only mode"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="px-4 py-2 text-sm font-semibold rounded-lg bg-gray-900 text-white hover:bg-gray-800"
            >
              Edit
            </button>
          ) : (
            <button
              onClick={() => {
                setEditMode(false);
                setDraftMarks(initialMarks);
              }}
              className="px-4 py-2 text-sm font-semibold rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200"
              disabled={isSaving}
            >
              Cancel Edit
            </button>
          )}

          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            disabled={!editMode || !isDirty || isSaving}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-4">
          {data.questions.map((q, idx) => {
            const maxMarks = q.marks;
            const current = draftMarks[q.questionId] ?? "";
            const displayValue = editMode ? current : current === "" ? "0" : current;

            return (
              <div
                key={q.questionId}
                className="border border-gray-200 rounded-xl p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Q{idx + 1}. {q.questionText}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Type: {q.type.toUpperCase()} • Max Marks: {maxMarks}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-xs font-semibold text-gray-700">
                      Marks:
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={maxMarks}
                      placeholder=""
                      value={displayValue}
                      disabled={!editMode}
                      onChange={(e) => {
                        const raw = e.target.value;
                        if (raw === "") {
                          setDraftMarks((prev) => ({
                            ...prev,
                            [q.questionId]: "",
                          }));
                          return;
                        }

                        const n = Number(raw);
                        if (!Number.isFinite(n)) return;
                        const clamped = Math.max(0, Math.min(maxMarks, n));
                        setDraftMarks((prev) => ({
                          ...prev,
                          [q.questionId]: String(clamped),
                        }));
                      }}
                      className={`w-24 px-2 py-1 border rounded-lg text-sm ${
                        editMode
                          ? "border-gray-300 bg-white"
                          : "border-gray-200 bg-gray-50 text-gray-700"
                      }`}
                    />
                  </div>
                </div>

                {q.type === "typing" ? (
                  <div className="mt-3">
                    <p className="text-xs font-semibold text-gray-700 mb-1">
                      Student Answer
                    </p>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-800 whitespace-pre-wrap">
                      {q.studentAnswer.writtenAnswer || "(No answer)"}
                    </div>
                  </div>
                ) : (
                  <div className="mt-3">
                    <p className="text-xs font-semibold text-gray-700 mb-1">
                      Options
                    </p>
                    <div className="space-y-2">
                      {q.options.map((opt) => {
                        const isSelected =
                          String(q.studentAnswer.selectedOptionId ?? "") ===
                          String(opt.id);
                        return (
                          <div
                            key={opt.id}
                            className={`flex items-center justify-between gap-3 p-2 rounded-lg border text-sm ${
                              opt.isCorrect
                                ? "border-green-200 bg-green-50"
                                : "border-gray-200 bg-white"
                            }`}
                          >
                            <span className="text-gray-800">{opt.text}</span>
                            <span className="text-xs font-semibold">
                              {opt.isCorrect ? "Correct" : ""}
                              {isSelected ? " (Selected)" : ""}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {editMode && (
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <button
                      onClick={() =>
                        setDraftMarks((prev) => ({
                          ...prev,
                          [q.questionId]: "",
                        }))
                      }
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-300 hover:bg-gray-50"
                    >
                      Clear
                    </button>
                    <button
                      onClick={() =>
                        setDraftMarks((prev) => ({
                          ...prev,
                          [q.questionId]: "0",
                        }))
                      }
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-300 hover:bg-gray-50"
                    >
                      0
                    </button>
                    <button
                      onClick={() =>
                        setDraftMarks((prev) => ({
                          ...prev,
                          [q.questionId]: String(maxMarks),
                        }))
                      }
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-green-600 text-white hover:bg-green-700"
                    >
                      Full ({maxMarks})
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="border border-gray-200 rounded-xl p-4 h-fit sticky top-0">
          <p className="text-sm font-semibold text-gray-900">Summary</p>
          <div className="mt-3 space-y-2 text-sm text-gray-700">
            {editMode && (
              <div className="flex items-center justify-between">
                <span>Total (Draft)</span>
                <span className="font-semibold">
                  {totalDraft}/{data.attempt.exam.totalMarks}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span>Current Score</span>
              <span className="font-semibold">
                {data.attempt.score}/{data.attempt.exam.totalMarks}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Passing marks</span>
              <span className="font-semibold">
                {data.attempt.exam.passingMarks}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Changes</span>
              <span
                className={`font-semibold ${isDirty ? "text-blue-700" : "text-gray-600"}`}
              >
                {isDirty ? "Unsaved" : "None"}
              </span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold rounded-lg border border-gray-300 hover:bg-gray-50"
              disabled={isSaving}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AttemptReviewModal;
