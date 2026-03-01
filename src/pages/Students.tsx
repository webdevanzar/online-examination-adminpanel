import { useState, useMemo } from "react";
import {
  Search,
  Users as UsersIcon,
  ArrowUpDown,
  Edit2,
  Trash2,
  Key,
} from "lucide-react";
import Table from "../components/Table";
import {
  useGetAllStudents,
  useDeleteStudent,
  type Student,
  useUpdateStudent,
} from "../services/student";
import { getInitials, sortByField } from "../utils/helpers";
import { StudentEditModal } from "../components/StudentEditModal";
import { DeleteConfirmationModal } from "../components/DeleteConfirmationModal";
import { PasswordResetModal } from "../components/PasswordResetModal";
import { VscActivateBreakpoints } from "react-icons/vsc";
import { RiVideoOnLine } from "react-icons/ri";
import { ActivateConfirmationModal } from "../components/ActivateConfirmationModal";
import { Modal } from "../components/Modal";

type SortField = "fullName" | "email" | "createdAt";
type SortDirection = "asc" | "desc";

export const Students: React.FC = () => {
  const [search, setSearch] = useState<string>("");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  // Modal states
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [activateModalOpen, setActivateModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const { data: students, isLoading, error } = useGetAllStudents();
  const deleteMutation = useDeleteStudent();
  const updateMutation = useUpdateStudent();

  // Handle sort
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Filter and sort students
  const filteredAndSortedStudents = useMemo(() => {
    if (!students) return [];

    // Filter by search
    let filtered = students.filter(
      (student) =>
        student.fullName.toLowerCase().includes(search.toLowerCase()) ||
        student.email.toLowerCase().includes(search.toLowerCase()),
    );

    // Sort
    filtered = sortByField(filtered, sortField, sortDirection);

    return filtered;
  }, [students, search, sortField, sortDirection]);

  // Handlers
  const handleEdit = (student: Student) => {
    setSelectedStudent(student);
    setEditModalOpen(true);
  };

  const handleDelete = (student: Student) => {
    setSelectedStudent(student);
    setDeleteModalOpen(true);
  };

  const handlePasswordReset = (student: Student) => {
    setSelectedStudent(student);
    setPasswordModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedStudent) {
      deleteMutation.mutate(selectedStudent.id, {
        onSuccess: () => {
          setDeleteModalOpen(false);
          setSelectedStudent(null);
        },
      });
    }
  };

  const handleActivate = (student: Student) => {
    setSelectedStudent(student);
    setActivateModalOpen(true);
  };

  const handleViewSelfieVideo = (student: Student) => {
    setSelectedStudent(student);
    setVideoModalOpen(true);
  };

  const confirmActivate = () => {
    if (selectedStudent) {
      updateMutation.mutate(
        { studentId: selectedStudent.id, data: { isActive: true } },
        {
          onSuccess: () => {
            setActivateModalOpen(false);
            setSelectedStudent(null);
          },
        },
      );
    }
  };

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="mb-10">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">
          Student{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600">
            Directory
          </span>
        </h2>
        <p className="text-slate-500 font-bold mt-2 uppercase tracking-widest text-xs">
          Manage and monitor all students registered in the system
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-8 rounded-4xl shadow-sm border border-slate-100 mb-10">
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Search */}
          <div className="flex-1 relative">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all font-medium"
            />
          </div>

          {/* Sort Buttons */}
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => handleSort("fullName")}
              className={`px-6 py-3 rounded-2xl border transition-all duration-300 flex items-center gap-2 text-sm font-bold ${
                sortField === "fullName"
                  ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
              }`}
            >
              Sort by Name
              {sortField === "fullName" && (
                <ArrowUpDown
                  size={14}
                  className={sortDirection === "desc" ? "rotate-180" : ""}
                />
              )}
            </button>

            <button
              onClick={() => handleSort("createdAt")}
              className={`px-6 py-3 rounded-2xl border transition-all duration-300 flex items-center gap-2 text-sm font-bold ${
                sortField === "createdAt"
                  ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
              }`}
            >
              Sort by Date
              {sortField === "createdAt" && (
                <ArrowUpDown
                  size={14}
                  className={sortDirection === "desc" ? "rotate-180" : ""}
                />
              )}
            </button>
          </div>
        </div>

        {/* Results Info */}
        {!isLoading && students && (
          <div className="mt-6 flex items-center gap-2 text-sm">
            <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full font-bold">
              {filteredAndSortedStudents.length}
            </div>
            <span className="text-slate-500 font-medium">
              students registered in the system
            </span>
          </div>
        )}
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800 text-sm">
            Failed to load students. Please try refreshing the page.
          </p>
        </div>
      )}

      {/* Table */}
      {isLoading ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : filteredAndSortedStudents.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <UsersIcon className="mx-auto text-gray-300 mb-4" size={64} />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No students found
          </h3>
          <p className="text-gray-500 text-sm">
            {search
              ? "Try adjusting your search criteria"
              : "No students have registered yet"}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-4xl shadow-sm border border-slate-100 overflow-hidden">
          <Table
            fields={[
              "SL No",
              "Profile",
              "Name",
              "Email",
              "Phone",
              "Joined",
              "Actions",
            ]}
            data={filteredAndSortedStudents}
            formatRow={(student, i: number) => (
              <>
                <td className="p-4 text-slate-600 font-medium whitespace-nowrap">
                  {i + 1}
                </td>
                <td className="p-4 whitespace-nowrap">
                  {student.profileImage ? (
                    <img
                      src={student.profileImage}
                      alt={student.fullName}
                      className="h-10 w-10 rounded-full border border-slate-100 object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
                      <span className="text-blue-600 text-sm font-bold">
                        {getInitials(student.fullName)}
                      </span>
                    </div>
                  )}
                </td>
                <td className="p-4 font-bold text-slate-900 whitespace-nowrap">
                  {student.fullName}
                </td>
                <td className="p-4 text-slate-500 font-medium whitespace-nowrap">
                  {student.email}
                </td>
                <td className="p-4 text-slate-500 font-medium whitespace-nowrap">
                  {student.phoneNumber || "—"}
                </td>
                <td className="p-4 text-slate-500 font-medium whitespace-nowrap text-sm">
                  {new Date(student.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="p-4 whitespace-nowrap">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(student)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                      title="Edit student"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handlePasswordReset(student)}
                      className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
                      title="Reset password"
                    >
                      <Key size={18} />
                    </button>
                    {student.selfieVideo && (
                      <button
                        onClick={() => handleViewSelfieVideo(student)}
                        className="p-2 text-violet-600 hover:bg-violet-50 rounded-xl transition-colors"
                        title="View selfie video"
                      >
                        <RiVideoOnLine size={18} />
                      </button>
                    )}
                    {student.isActive ? (
                      <button
                        onClick={() => handleDelete(student)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                        title="Delete student"
                      >
                        <Trash2 size={18} />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleActivate(student)}
                        className="p-2 text-emerald-600 hover:bg-emerald-50 cursor-pointer rounded-xl transition-colors"
                        title="Activate student"
                      >
                        <VscActivateBreakpoints size={18} />
                      </button>
                    )}
                  </div>
                </td>
              </>
            )}
            stickyHeaderOffset="0px"
          />
        </div>
      )}

      {/* Modals */}
      {selectedStudent && (
        <>
          <StudentEditModal
            isOpen={editModalOpen}
            onClose={() => setEditModalOpen(false)}
            student={selectedStudent}
          />
          <DeleteConfirmationModal
            isOpen={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            onConfirm={confirmDelete}
            title="Delete Student"
            message={`Are you sure you want to delete ${selectedStudent.fullName}? This will mark the student as inactive.`}
            isLoading={deleteMutation.isPending}
          />
          <ActivateConfirmationModal
            isOpen={activateModalOpen}
            onClose={() => setActivateModalOpen(false)}
            onConfirm={confirmActivate}
            title="Activate Student"
            message={`Are you sure you want to activate ${selectedStudent.fullName}? This will mark the student as active.`}
            isLoading={deleteMutation.isPending}
          />
          <PasswordResetModal
            isOpen={passwordModalOpen}
            onClose={() => setPasswordModalOpen(false)}
            studentId={selectedStudent.id}
            studentName={selectedStudent.fullName}
          />
          <Modal
            isOpen={videoModalOpen}
            onClose={() => setVideoModalOpen(false)}
            title={`Selfie Video — ${selectedStudent.fullName}`}
            size="md"
          >
            {selectedStudent.selfieVideo ? (
              <video
                src={selectedStudent.selfieVideo}
                controls
                autoPlay
                className="w-full rounded-2xl"
              />
            ) : (
              <p className="text-slate-500 text-center py-8">
                No selfie video available for this student.
              </p>
            )}
          </Modal>
        </>
      )}
    </div>
  );
};
