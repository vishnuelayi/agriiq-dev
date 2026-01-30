import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchExamQuestions } from "../services/questionService";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebase";
import useAuth from "../hooks/useAuth";

const ExamAttempt = () => {
  const { examId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [loading, setLoading] = useState(true);

  // prevents multiple auto-submits
  const submittedRef = useRef(false);

  /* ---------------- LOAD QUESTIONS ---------------- */
  useEffect(() => {
    const load = async () => {
      try {
        const qs = await fetchExamQuestions(examId);

        if (!qs || qs.length === 0) {
          alert("No questions found for this exam.");
          navigate("/");
          return;
        }

        setQuestions(qs);
        setTimeLeft(qs.length * 60); // 1 min per question
      } catch (err) {
        console.error("Failed to load questions:", err);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [examId, navigate]);

  /* ---------------- TIMER ---------------- */
  useEffect(() => {
    if (timeLeft === null) return;
    if (submittedRef.current) return;

    if (timeLeft <= 0) {
      handleSubmit(true); // auto submit
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

    if (!user || questions.length === 0) return;

    const score = calculateScore();

    try {
      await addDoc(collection(db, "attempts"), {
        userId: user.uid,
        examId,
        answers,
        score,
        totalQuestions: questions.length,
        durationTaken:
          questions.length * 60 - (timeLeft ?? questions.length * 60),
        submittedAt: serverTimestamp(),
        autoSubmitted: auto,
      });
    } catch (err) {
      console.error("Failed to submit attempt:", err);
    }

    navigate("/");
  };

  /* ---------------- UI ---------------- */
  if (loading) return <div className="p-4">Loading exam...</div>;

  return (
    <div className="p-4 space-y-4">
      <div className="font-bold text-lg">
        Time Left: {Math.floor(timeLeft / 60)}:
        {String(timeLeft % 60).padStart(2, "0")}
      </div>

      {questions.map((q, index) => (
        <div key={q.id} className="border p-3 rounded">
          <div className="font-semibold mb-2">
            {index + 1}. {q.question}
          </div>

          {q.options.map((opt, i) => (
            <label key={i} className="block space-x-2">
              <input
                type="radio"
                name={q.id}
                checked={answers[q.id] === i}
                onChange={() => handleAnswer(q.id, i)}
              />
              <span>{opt}</span>
            </label>
          ))}
        </div>
      ))}

      <button
        onClick={() => handleSubmit(false)}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Submit Exam
      </button>
    </div>
  );
};

export default ExamAttempt;
