import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import useAuth from "../hooks/useAuth";
import { fetchPublishedExams } from "../services/examService";
import { fetchUserExams } from "../services/userExamService";
import { fetchAttemptCount } from "../services/attemptService";
import ExamCard from "../components/ExamCard";
import PaymentModal from "../components/PaymentModal";
import AppLayout from "../layouts/AppLayout";
import Card from "../ui/Card";
import Button from "../ui/Button";
import { useNavigate } from "react-router-dom";
import AnnouncementBanner from "../components/AnnouncementBanner";

/* ---------------- SKELETON CARD ---------------- */
const ExamCardSkeleton = () => (
  <div className="animate-pulse bg-white rounded-3xl p-6 space-y-4 border border-gray-100">
    <div className="h-5 bg-gray-200 rounded w-3/4" />
    <div className="h-4 bg-gray-200 rounded w-1/2" />
    <div className="flex justify-between items-center mt-6">
      <div className="h-6 bg-gray-200 rounded w-20" />
      <div className="h-9 bg-gray-200 rounded w-28" />
    </div>
  </div>
);

const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [exams, setExams] = useState([]);
  const [unlockedExamIds, setUnlockedExamIds] = useState([]);
  const [attemptCounts, setAttemptCounts] = useState({});
  const [loading, setLoading] = useState(true);

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

          const counts = {};
          for (const exam of examsData) {
            counts[exam.id] = await fetchAttemptCount(user.uid, exam.id);
          }
          setAttemptCounts(counts);
        }
      } catch (err) {
        console.error("Failed to load dashboard:", err);
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
        <Button variant="danger" onClick={handleLogout}>
          Logout
        </Button>
      }
    >
       <AnnouncementBanner />
      {/* AVAILABLE EXAMS */}
      <section className="space-y-4 mt-4 ">
        <h2 className="text-lg font-semibold">Available Exams</h2>

        {loading && (
          <div className="grid gap-4 md:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <ExamCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!loading && exams.length === 0 && (
          <Card>
            <p className="text-gray-500">No exams available right now.</p>
          </Card>
        )}

        {!loading && exams.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2">
            {exams.map((exam) => {
              const purchased = unlockedExamIds.includes(exam.id);

              return (
                <ExamCard
                  key={exam.id}
                  exam={exam}
                  purchased={purchased}
                  onBuy={handleBuyExam}
                />
              );
            })}
          </div>
        )}
      </section>

      {/* MY EXAMS */}
      <section className="space-y-4 mt-10">
        <h2 className="text-lg font-semibold">My Exams</h2>

        {loading && (
          <div className="grid gap-4 md:grid-cols-2">
            {[...Array(2)].map((_, i) => (
              <ExamCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!loading && unlockedExamIds.length === 0 && (
          <Card>
            <p className="text-gray-500">
              You haven’t purchased any exams yet.
            </p>
          </Card>
        )}

        {!loading &&
          unlockedExamIds.length > 0 &&
          exams
            .filter((e) => unlockedExamIds.includes(e.id))
            .map((exam) => {
              const used = attemptCounts[exam.id] || 0;
              const max = exam.maxReattempts || 1;
              const remaining = Math.max(max - used, 0);

              return (
                <ExamCard
                  key={exam.id}
                  exam={exam}
                  mode="owned"
                  remainingAttempts={remaining}
                  blocked={remaining === 0}
                  onStart={() => navigate(`/exam/${exam.id}`)}
                />
              );
            })}
      </section>

      {showPaymentModal && selectedExam && (
        <PaymentModal
          exam={selectedExam}
          onClose={closePaymentModal}
        />
      )}
    </AppLayout>
  );
};

export default UserDashboard;
