import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchExamQuestions } from "../services/questionService";
import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import useAuth from "../hooks/useAuth";
import { fetchAttemptCount } from "../services/attemptService";
import AppLayout from "../layouts/AppLayout";
import Button from "../ui/Button";
import { toast } from "sonner";
import { Timer } from "lucide-react";

const ExamAttempt = () => {
  const { examId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [loading, setLoading] = useState(true);

  const submittedRef = useRef(false);

  /* ---------------- LOAD EXAM + QUESTIONS ---------------- */
  useEffect(() => {
    if (!user) return;

    const load = async () => {
      try {
        // 1️⃣ Load exam
        const examSnap = await getDoc(doc(db, "exams", examId));
        if (!examSnap.exists()) {
          toast.error("Exam not found");
          navigate("/");
          return;
        }

        const examData = examSnap.data();
        setExam(examData);

        // 2️⃣ Reattempt check
        const attemptCount = await fetchAttemptCount(user.uid, examId);
        const maxReattempts = examData.maxReattempts || 1;

        if (attemptCount >= maxReattempts) {
          toast.error("Reattempt limit reached");
          navigate("/");
          return;
        }

        // 3️⃣ Load questions
        const qs = await fetchExamQuestions(examId);
        if (!qs || qs.length === 0) {
          toast.error("No questions found for this exam");
          navigate("/");
          return;
        }

        setQuestions(qs);

        // ✅ USE EXAM DURATION (minutes → seconds)
        const durationMinutes = examData.duration || qs.length;
        setTimeLeft(durationMinutes * 60);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load exam");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [examId, user, navigate]);

  /* ---------------- TIMER ---------------- */
  useEffect(() => {
    if (timeLeft === null || submittedRef.current) return;

    if (timeLeft <= 0) {
      handleSubmit(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  /* ---------------- ANSWERS ---------------- */
  const handleAnswer = (qid, optionIndex) => {
    setAnswers((prev) => ({ ...prev, [qid]: optionIndex }));
  };

  /* ---------------- SCORING ---------------- */
  const calculateScore = () => {
    let score = 0;

    questions.forEach((q) => {
      const ans = answers[q.id];
      if (ans === undefined) return;
      if (ans === q.correctOption) score += 1;
      else score -= 1 / 3;
    });

    return Number(score.toFixed(2));
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (auto = false) => {
    if (submittedRef.current) return;
    submittedRef.current = true;

    const totalDuration =
      (exam?.duration || questions.length) * 60;

    try {
      await addDoc(collection(db, "attempts"), {
        userId: user.uid,
        examId,
        answers,
        score: calculateScore(),
        totalQuestions: questions.length,
        durationTaken:
          totalDuration - (timeLeft ?? totalDuration),
        submittedAt: serverTimestamp(),
        autoSubmitted: auto,
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit exam");
    }

    navigate(`/results/${examId}`);
  };

  /* ---------------- UI ---------------- */
  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading exam…
      </div>
    );
  }

  const isLowTime = timeLeft <= 300;

  return (
    <AppLayout
      title={exam?.title || "Exam"}
      actions={
        <div
          className={`flex items-center gap-2 text-sm font-semibold transition
            ${isLowTime ? "text-red-600 animate-pulse" : "text-gray-700"}
          `}
        >
          <Timer size={18} />
          <span>
            {Math.floor(timeLeft / 60)}:
            {String(timeLeft % 60).padStart(2, "0")}
          </span>
        </div>
      }
    >
      <div className="mb-4 text-sm text-gray-500">
        Answered {Object.keys(answers).length} / {questions.length}
      </div>

      <div className="space-y-6">
        {questions.map((q, index) => (
          <div
            key={q.id}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4"
          >
            <div className="font-semibold text-gray-900">
              {index + 1}. {q.question}
            </div>

            <div className="space-y-2">
              {q.options.map((opt, i) => {
                const selected = answers[q.id] === i;

                return (
                  <label
                    key={i}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition
                      ${
                        selected
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 hover:bg-gray-50"
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name={q.id}
                      checked={selected}
                      onChange={() => handleAnswer(q.id, i)}
                      className="accent-green-600"
                    />
                    <span className="text-sm text-gray-800">
                      {opt}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="sticky bottom-0 bg-white border-t mt-8 p-4 flex justify-end">
        <Button onClick={() => handleSubmit(false)}>
          Submit Exam
        </Button>
      </div>
    </AppLayout>
  );
};

export default ExamAttempt;
