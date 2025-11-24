import { useState } from "react";

const CreateExamPopup = ({ onClose, onSave }) => {
  const [form, setForm] = useState({
    // Exam Fields
    title: "",
    description: "",
    subject: "",
    instructions: "",

    startTime: "",
    endTime: "",
    duration: "",
    totalMarks: "",
    passingMarks: "",

    microphoneRequired: false,
    faceDetectionRequired: true,

    // Question Fields
    questionText: "",
    marks: "",
    type: "mcq",
    hasMultipleCorrect: false,

    answerMinLength: "",
    answerMaxLength: "",

    options: [
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
    ],
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleOptionChange = (index, field, value) => {
    const updated = [...form.options];
    updated[index][field] = value;
    setForm({ ...form, options: updated });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 w-[650px] rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Create Exam</h2>
          <button onClick={onClose} className="text-xl font-bold text-gray-500">
            ✖
          </button>
        </div>

        {/* ---------------- EXAM FIELDS ---------------- */}
        <h3 className="font-semibold text-lg mb-2">Exam Details</h3>

        <div className="grid grid-cols-2 gap-4">

          <input
            type="text"
            name="title"
            placeholder="Exam Title"
            value={form.title}
            onChange={handleChange}
            className="border p-2 rounded-lg"
          />

          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={form.subject}
            onChange={handleChange}
            className="border p-2 rounded-lg"
          />

          <input
            type="number"
            name="totalMarks"
            placeholder="Total Marks"
            value={form.totalMarks}
            onChange={handleChange}
            className="border p-2 rounded-lg"
          />

          <input
            type="number"
            name="passingMarks"
            placeholder="Passing Marks"
            value={form.passingMarks}
            onChange={handleChange}
            className="border p-2 rounded-lg"
          />

          <input
            type="datetime-local"
            name="startTime"
            value={form.startTime}
            onChange={handleChange}
            className="border p-2 rounded-lg"
          />

          <input
            type="datetime-local"
            name="endTime"
            value={form.endTime}
            onChange={handleChange}
            className="border p-2 rounded-lg"
          />

          <input
            type="number"
            name="duration"
            placeholder="Duration (Minutes)"
            value={form.duration}
            onChange={handleChange}
            className="border p-2 rounded-lg"
          />
        </div>

        <textarea
          name="description"
          placeholder="Exam Description"
          value={form.description}
          onChange={handleChange}
          className="border p-3 rounded-lg w-full mt-3 h-20"
        ></textarea>

        <textarea
          name="instructions"
          placeholder="Instructions"
          value={form.instructions}
          onChange={handleChange}
          className="border p-3 rounded-lg w-full mt-2 h-20"
        ></textarea>

        {/* SETTINGS */}
        <div className="flex gap-6 mt-3">
          <label className="flex gap-2 items-center">
            <input
              type="checkbox"
              name="microphoneRequired"
              checked={form.microphoneRequired}
              onChange={handleChange}
            />
            Microphone Required
          </label>

          <label className="flex gap-2 items-center">
            <input
              type="checkbox"
              name="faceDetectionRequired"
              checked={form.faceDetectionRequired}
              onChange={handleChange}
            />
            Face Detection Required
          </label>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end mt-6 gap-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-lg">
            Cancel
          </button>

          <button
            onClick={() => onSave(form)}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save Exam
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateExamPopup;
