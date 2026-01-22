import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { auth } from "../firebase/firebase";
import { signOut } from "firebase/auth";
import { fetchPublishedExams } from "../services/examService";
import ExamCard from "../components/ExamCard";

const UserDashboard = () => {
  const { profile } = useAuth();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    await signOut(auth);
  };

  useEffect(() => {
    const loadExams = async () => {
      const data = await fetchPublishedExams();
      setExams(data);
      setLoading(false);
    };

    loadExams();
  }, []);

  return (
    <div className="min-h-screen p-4 space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-xl font-bold">AgriIQ Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </header>

      <section>
        <h2 className="text-lg font-semibold mb-2">Available Exams</h2>

        {loading && <div className="text-gray-500">Loading exams...</div>}

        {!loading && exams.length === 0 && (
          <div className="border p-4 rounded text-gray-500">
            No exams available right now
          </div>
        )}

        {!loading && exams.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2">
            {exams.map((exam) => (
              <ExamCard key={exam.id} exam={exam} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2">My Exams</h2>
        <div className="border p-4 rounded text-gray-500">
          You have not purchased any exams
        </div>
      </section>
    </div>
  );
};

export default UserDashboard;
