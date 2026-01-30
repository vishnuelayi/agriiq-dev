import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import useAuth from "../hooks/useAuth";
import { fetchPublishedExams } from "../services/examService";
import ExamCard from "../components/ExamCard";
import PaymentModal from "../components/PaymentModal";
import { fetchUserExams } from "../services/userExamService";


const UserDashboard = () => {
  const { profile, user } = useAuth();

  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unlockedExamIds, setUnlockedExamIds] = useState([]);


  const [selectedExam, setSelectedExam] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleBuyExam = (exam) => {
    setSelectedExam(exam);
    setShowPaymentModal(true);
  };

  const closePaymentModal = () => {
    setSelectedExam(null);
    setShowPaymentModal(false);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const examsData = await fetchPublishedExams();
        setExams(examsData);

        if (user) {
          const unlocked = await fetchUserExams(user.uid);
          setUnlockedExamIds(unlocked);
        } else {
          setUnlockedExamIds([]);
        }
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);



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
            No exams available
          </div>
        )}

        {!loading && exams.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2">
            {exams
              .filter((e) => !unlockedExamIds.includes(e.id))
              .map((exam) => (
                <ExamCard key={exam.id} exam={exam} onBuy={handleBuyExam} />
              ))}

          </div>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2">My Exams</h2>

        {loading && (
          <div className="text-gray-500">Loading your exams...</div>
        )}

        {!loading && unlockedExamIds.length === 0 && (
          <div className="border p-4 rounded text-gray-500">
            You haven’t purchased any exams yet.
          </div>
        )}

        {!loading &&
          unlockedExamIds.length > 0 &&
          exams
            .filter((e) => unlockedExamIds.includes(e.id))
            .map((exam) => (
              <div key={exam.id} className="border p-3 rounded">
                <h3 className="font-semibold">{exam.title}</h3>
                <button className="mt-2 bg-blue-600 text-white px-3 py-1 rounded">
                  Start Exam
                </button>
              </div>
            ))}
      </section>


      {showPaymentModal && selectedExam && (
        <PaymentModal
          exam={selectedExam}
          onClose={closePaymentModal}
        />
      )}
    </div>
  );
};

export default UserDashboard;
