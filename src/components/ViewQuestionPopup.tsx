import React, { useState } from "react";
import Modal from "./Modal";
import UpdateQuestionPopup from "./UpdateQuestionPopup";

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

const ViewQuestionPopup: React.FC<Props> = ({
  isOpen,
  question,
  onClose,
  onUpdate,
  onDelete,
}) => {
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);

  const handleClose = () => {
    onClose();
  };

  const handleDelete = () => {
    if (!question) return;
    if (window.confirm("Are you sure you want to delete this question?")) {
      onDelete(question.order);
      onClose();
    }
  };

  if (!question) return null;

  return (
    <>
      <Modal title="Question" isOpen={isOpen} onClose={handleClose}>
        <div className="p-6 w-full max-w-2xl">
          <h2 className="text-2xl font-bold mb-6">Question {question.order}</h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-700 mb-1">Question:</h3>
              <p className="text-gray-800">{question.questionText}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-gray-700 mb-1">Type:</h3>
                <p className="capitalize">{question.type}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-1">Marks:</h3>
                <p>{question.marks}</p>
              </div>
            </div>

            {question.type === "mcq" && question.options && (
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Options:</h3>
                <ul className="space-y-2">
                  {question.options.map((opt, i) => (
                    <li
                      key={i}
                      className={`p-3 border rounded ${
                        opt.isCorrect
                          ? "border-green-300 bg-green-50"
                          : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-start">
                        <span className="font-medium mr-2">
                          {String.fromCharCode(65 + i)}.
                        </span>
                        <span
                          className={
                            opt.isCorrect ? "text-green-700 font-medium" : ""
                          }
                        >
                          {opt.optionText}
                        </span>
                        {opt.isCorrect && (
                          <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                            Correct Answer
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {question.type === "typing" && (
              <div className="bg-gray-50 p-4 rounded">
                <h3 className="font-semibold text-gray-700 mb-2">
                  Answer Requirements:
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">
                      Minimum length:
                    </span>
                    <p className="font-medium">
                      {question.answerMinLength || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">
                      Maximum length:
                    </span>
                    <p className="font-medium">
                      {question.answerMaxLength || "Not specified"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setIsUpdateOpen(true);
                  handleClose();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Edit 
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Delete
              </button>
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {isUpdateOpen && question && (
        <UpdateQuestionPopup
          isOpen={isUpdateOpen}
          initialData={{
            ...question,
            options: question.options || [],
            answerMinLength: question.answerMinLength || undefined,
            answerMaxLength: question.answerMaxLength || undefined,
          }}
          onClose={() => setIsUpdateOpen(false)}
          onUpdate={(updated) => {
            onUpdate(updated as QuestionViewData);
            setIsUpdateOpen(false);
          }}
        />
      )}
    </>
  );
};

export default ViewQuestionPopup;
