import { useState } from "react";
import Table from "../components/Table";

export const Results = () => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([
    { name: "John Doe", score: 85, status: "Pass" },
    { name: "Emma Watson", score: 92, status: "Pass" },
    { name: "Liam Carter", score: 42, status: "Fail" },
    { name: "Sophia Taylor", score: 30, status: "Fail" },
  ]);

  const [deleteTarget, setDeleteTarget] = useState<null | string>(null);
  const [editTarget, setEditTarget] = useState<null | string>(null);
  const [editForm, setEditForm] = useState({ name: "", score: "", status: "" });

  const startEdit = (student: any) => {
    setEditTarget(student.name);
    setEditForm({
      name: student.name,
      score: String(student.score),
      status: student.status,
    });
  };

  const saveUpdate = () => {
    setResults((prev) =>
      prev.map((s) =>
        s.name === editTarget
          ? {
              name: editForm.name,
              score: Number(editForm.score),
              status: editForm.status,
            }
          : s
      )
    );
    setEditTarget(null);
  };

  const confirmDelete = () => {
    setResults((prev) => prev.filter((r) => r.name !== deleteTarget));
    setDeleteTarget(null);
  };

  const filtered = results.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 w-full">
      <h2 className="text-3xl md:text-4xl font-bold mb-2 text-gray-800">
        Exam Results
      </h2>
      <p className="text-gray-600 mb-8 text-lg">
        Review the performance of all students
      </p>

      {/* Search */}
      <div className="w-full bg-white p-4 rounded-xl shadow mb-6">
        <input
          type="text"
          placeholder="Search student by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* TABLE CONTAINER */}
      <Table
        fields={["S.No", "Student Name", "Score", "Status", "Actions"]}
        data={filtered}
        formatRow={(student: { name: string; score: number; status: string }, index: number) => (
          <>
            <td className="p-4 font-medium whitespace-nowrap">{index + 1}</td>
            <td className="p-4 font-medium whitespace-nowrap">{student.name}</td>
            <td className="p-4 whitespace-nowrap">{student.score}</td>
            <td
              className={`p-4 font-semibold whitespace-nowrap ${
                student.status === "Fail" ? "text-red-600" : "text-green-600"
              }`}
            >
              {student.status}
            </td>
            <td className="p-4">
              <div className="flex gap-2 min-w-[200px]">
                <button
                  onClick={() => startEdit(student)}
                  className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm min-w-[80px]"
                >
                  Update
                </button>
                <button
                  onClick={() => setDeleteTarget(student.name)}
                  className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm min-w-[80px]"
                >
                  Delete
                </button>
              </div>
            </td>
          </>
        )}
        stickyHeaderOffset="0px"
      />

      {/* DELETE POPUP */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm text-center">
            <h3 className="text-xl font-semibold mb-3">Delete Result?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete
              <span className="font-bold text-red-600"> {deleteTarget} </span>?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UPDATE POPUP */}
      {editTarget && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm">
            <h3 className="text-xl font-semibold mb-4 text-center">
              Update Student
            </h3>

            <div className="flex flex-col gap-3">
              <input
                type="text"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
                className="border p-2 rounded-lg w-full"
                placeholder="Student Name"
              />

              <input
                type="number"
                value={editForm.score}
                onChange={(e) =>
                  setEditForm({ ...editForm, score: e.target.value })
                }
                className="border p-2 rounded-lg w-full"
                placeholder="Score"
              />

              <select
                value={editForm.status}
                onChange={(e) =>
                  setEditForm({ ...editForm, status: e.target.value })
                }
                className="border p-2 rounded-lg w-full"
              >
                <option value="Pass">Pass</option>
                <option value="Fail">Fail</option>
              </select>
            </div>

            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={() => setEditTarget(null)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={saveUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
