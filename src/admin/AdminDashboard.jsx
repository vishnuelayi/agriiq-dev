import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import PaymentApproval from "./PaymentApproval";
import AdminLayout from "./AdminLayout";

const AdminDashboard = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const loadExams = async () => {
      try {
        const snapshot = await getDocs(collection(db, "exams"));
        setExams(
          snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          })),
        );
      } catch (err) {
        console.error("Failed to load exams:", err);
      } finally {
        setLoading(false);
      }
    };

    loadExams();
  }, []);

  const updateStatus = async (examId, status) => {
    try {
      await updateDoc(doc(db, "exams", examId), { status });
      setExams((prev) =>
        prev.map((e) => (e.id === examId ? { ...e, status } : e)),
      );
    } catch (err) {
      console.error("Failed to update exam status:", err);
    }
  };

  const deleteExam = async (examId) => {
    const confirmDelete = window.confirm(
      "Are you sure? This will permanently delete the exam.",
    );
    if (!confirmDelete) return;

    await deleteDoc(doc(db, "exams", examId));
    setExams((prev) => prev.filter((e) => e.id !== examId));
  };

  if (loading) return <div className="p-4">Loading admin dashboard...</div>;

  return (
    <AdminLayout title="Dashboard">
      <header className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>

        <div className="flex gap-2">
          <button
            onClick={() => navigate("/admin/exams/create")}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Create Exam
          </button>
          <button
            onClick={() => navigate("/admin/analytics")}
            className="bg-purple-600 text-white px-4 py-2 rounded"
          >
            View Analytics
          </button>
        </div>
      </header>

      {/* EXAMS SECTION */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">All Exams</h2>

        {exams.length === 0 && (
          <div className="text-gray-500">No exams created yet</div>
        )}

        {exams.map((exam) => (
          <div key={exam.id} className="border p-3 rounded space-y-2">
            <div className="font-semibold">{exam.title}</div>
            <div>Status: {exam.status}</div>

            <div className="flex gap-2 flex-wrap">
              {/* MANAGE QUESTIONS BUTTON */}
              <button
                onClick={() => navigate(`/admin/exams/${exam.id}/questions`)}
                className="bg-gray-200 px-3 py-1 rounded"
              >
                Manage Questions
              </button>

              {/* PREVIEW BUTTON */}
              <button
                onClick={() => navigate(`/admin/exams/${exam.id}/preview`)}
                className="bg-gray-300 px-3 py-1 rounded"
              >
                Preview
              </button>

              {exam.status !== "published" && (
                <button
                  onClick={async () => {
                    const snap = await getDocs(
                      collection(db, "questions", exam.id, "items"),
                    );

                    if (snap.empty) {
                      alert("Cannot publish exam without questions");
                      return;
                    }

                    updateStatus(exam.id, "published");
                  }}
                >
                  Publish
                </button>
              )}

              {/* ARCHIVE BUTTON */}
              {exam.status !== "archived" && (
                <button
                  onClick={() => updateStatus(exam.id, "archived")}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Archive
                </button>
              )}

              {/* DELETE BUTTON */}
              {exam.status !== "published" && (
                <button
                  onClick={() => deleteExam(exam.id)}
                  className="bg-red-700 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </section>

      {/* PAYMENTS SECTION */}
      <section className="space-y-3">
        <PaymentApproval />
      </section>
    </AdminLayout>
  );
};

export default AdminDashboard;
