import React, { useState } from "react";
import Modal from "./Modal";

interface OptionType {
  optionText: string;
  isCorrect: boolean;
}

export interface QuestionViewData {
  order: number;
  type: "typing" | "mcq";
  questionText: string;
  marks: number;
  answerMinLength?: number;
  answerMaxLength?: number;
  options?: OptionType[];
}

interface Props {
  isOpen: boolean;
  question: QuestionViewData | null;
  onClose: () => void;
  onUpdate: (updated: QuestionViewData) => void;
  onDelete: (order: number) => void;
}

const ViewQuestionPopup: React.FC<Props> = ({ isOpen, question, onClose, onUpdate, onDelete }) => {
  const [editMode, setEditMode] = useState(false);

  const [type, setType] = useState<QuestionViewData["type"]>("mcq");
  const [questionText, setQuestionText] = useState("");
  const [marks, setMarks] = useState(1);
  const [options, setOptions] = useState<OptionType[]>([{ optionText: "", isCorrect: false }]);
  const [answerMinLength, setAnswerMinLength] = useState<number | undefined>(undefined);
  const [answerMaxLength, setAnswerMaxLength] = useState<number | undefined>(undefined);

  const startEdit = () => {
    if (!question) return;
    setType(question.type);
    setQuestionText(question.questionText);
    setMarks(question.marks);
    setOptions(question.options || [{ optionText: "", isCorrect: false }]);
    setAnswerMinLength(question.answerMinLength);
    setAnswerMaxLength(question.answerMaxLength);
    setEditMode(true);
  };

  const handleClose = () => {
    setEditMode(false);
    onClose();
  };

  const handleOptionChange = (index: number, field: "optionText" | "isCorrect", value: string | boolean) => {
    const updated = [...options];
    if (field === "optionText") updated[index].optionText = String(value);
    if (field === "isCorrect") updated[index].isCorrect = Boolean(value);
    setOptions(updated);
  };

  const handleSingleCorrect = (index: number) => {
    const updated = options.map((opt, i) => ({ ...opt, isCorrect: i === index }));
    setOptions(updated);
  };

  const addOption = () => setOptions((prev) => [...prev, { optionText: "", isCorrect: false }]);
  const removeOption = (index: number) => {
    if (options.length > 1) setOptions(options.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!question) return;
    onUpdate({
      order: question.order,
      type,
      questionText,
      marks,
      options: type === "mcq" ? options : undefined,
      answerMinLength: type === "typing" ? answerMinLength : undefined,
      answerMaxLength: type === "typing" ? answerMaxLength : undefined,
    });
    setEditMode(false);
  };

  const handleDelete = () => {
    if (!question) return;
    onDelete(question.order);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={editMode ? "Edit Question" : "Question Details"} size="lg">
      {!question ? null : (
        <div className="space-y-6">
          {/* Toggle edit */}
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">Order #{question.order}</p>
            <div className="flex gap-2">
              {!editMode && (
                <button onClick={startEdit} className="px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">Edit</button>
              )}
              <button onClick={handleDelete} className="px-3 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600">Delete</button>
            </div>
          </div>

          {/* Type Tabs (edit mode only) */}
          {editMode ? (
            <div className="flex gap-2 border-b pb-2">
              {["mcq", "typing"].map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t as QuestionViewData["type"])}
                  className={`px-3 py-2 rounded-md text-sm transition ${type === t ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"}`}
                >
                  {t === "mcq" ? "MCQ" : "Typing Answer"}
                </button>
              ))}
            </div>
          ) : (
            <div>
              <span className="inline-flex items-center px-2 py-1 text-xs rounded bg-blue-50 text-blue-700 border border-blue-100">{question.type.toUpperCase()}</span>
            </div>
          )}

          {/* Question text */}
          <div className="space-y-2">
            <label className="font-medium">Question</label>
            {editMode ? (
              <textarea className="w-full border rounded-lg p-3" rows={3} value={questionText} onChange={(e) => setQuestionText(e.target.value)} />
            ) : (
              <p className="text-gray-800 leading-relaxed">{question.questionText}</p>
            )}
          </div>

          {/* Marks */}
          <div className="space-y-2">
            <label className="font-medium">Marks</label>
            {editMode ? (
              <input type="number" className="w-full border rounded-lg p-3" value={marks} onChange={(e) => setMarks(Number(e.target.value))} />
            ) : (
              <p className="text-gray-700">{question.marks}</p>
            )}
          </div>

          {/* Type-specific content */}
          {(editMode ? type : question.type) === "mcq" ? (
            <div className="space-y-3">
              <h3 className="font-medium text-lg">Options</h3>
              {editMode && (
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-sm text-gray-700">Allow multiple correct answers</span>
                </label>
              )}
              <div className="space-y-3">
                {(editMode ? options : (question.options || [])).map((opt, index) => (
                  <div key={index} className="flex items-center gap-4 border rounded-lg p-3">
                    {editMode ? (
                      <>
                        <input
                          type="text"
                          placeholder={`Option ${index + 1}`}
                          className="flex-1 border rounded p-2"
                          value={opt.optionText}
                          onChange={(e) => handleOptionChange(index, "optionText", e.target.value)}
                        />
                        <input
                          type="radio"
                          name="correctAnswer"
                          checked={opt.isCorrect}
                          onChange={() => handleSingleCorrect(index)}
                        />
                        {options.length > 1 && (
                          <button className="text-red-500" onClick={() => removeOption(index)}>✕</button>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="flex-1">
                          <p className="text-gray-800">{opt.optionText || `Option ${index + 1}`}</p>
                        </div>
                        {opt.isCorrect && (
                          <span className="text-xs px-2 py-1 rounded bg-green-50 text-green-700 border border-green-200">Correct</span>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
              {editMode && (
                <button onClick={addOption} className="text-blue-600 mt-2 hover:underline">+ Add Option</button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="font-medium">Minimum Answer Length</label>
                {editMode ? (
                  <input type="number" className="w-full border rounded-lg p-3" value={answerMinLength ?? ""} onChange={(e) => setAnswerMinLength(Number(e.target.value))} />
                ) : (
                  <p className="text-gray-700">{question.answerMinLength ?? "—"}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="font-medium">Maximum Answer Length</label>
                {editMode ? (
                  <input type="number" className="w-full border rounded-lg p-3" value={answerMaxLength ?? ""} onChange={(e) => setAnswerMaxLength(Number(e.target.value))} />
                ) : (
                  <p className="text-gray-700">{question.answerMaxLength ?? "—"}</p>
                )}
              </div>
            </div>
          )}

          {/* Footer actions */}
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={handleClose} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Close</button>
            {editMode && (
              <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Changes</button>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ViewQuestionPopup;
