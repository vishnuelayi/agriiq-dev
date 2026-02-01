import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import useAuth from "../hooks/useAuth";
import { fetchPublishedExams } from "../services/examService";
import ExamCard from "../components/ExamCard";
import PaymentModal from "../components/PaymentModal";
import { fetchUserExams } from "../services/userExamService";
import { useNavigate } from "react-router-dom";
import { fetchAttemptCount } from "../services/attemptService";
import AppLayout from "../layouts/AppLayout";
import Card from "../ui/Card";
import Button from "../ui/Button";

const UserDashboard = () => {
  const { profile, user } = useAuth();

  const navigate = useNavigate();

  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unlockedExamIds, setUnlockedExamIds] = useState([]);

  const [attemptCounts, setAttemptCounts] = useState({});

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

        if (user) {
          const counts = {};

          for (const exam of examsData) {
            counts[exam.id] = await fetchAttemptCount(user.uid, exam.id);
          }

          setAttemptCounts(counts);
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
    <AppLayout
      title="AgriIQ Dashboard"
      actions={
        <Button variant="ghost" onClick={handleLogout}>
          Logout
        </Button>
      }
    >
      {/* AVAILABLE EXAMS */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Available Exams</h2>

        {loading && <p className="text-muted">Loading exams...</p>}

        {!loading && exams.length === 0 && (
          <Card>
            <p className="text-muted">No exams available right now.</p>
          </Card>
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

      <section className="space-y-4">
        <h2 className="text-lg font-semibold mb-2">My Exams</h2>

        {loading && <div className="text-gray-500">Loading your exams...</div>}

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
              <ExamCard
                key={exam.id}
                exam={exam}
                mode="owned"
                blocked={attemptCounts[exam.id] >= (exam.maxReattempts || 1)}
                onStart={() => navigate(`/exam/${exam.id}`)}
              />
            ))}
      </section>

      {showPaymentModal && selectedExam && (
        <PaymentModal exam={selectedExam} onClose={closePaymentModal} />
      )}
    </AppLayout>
  );
};

export default UserDashboard;
