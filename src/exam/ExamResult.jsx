import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { fetchLatestAttempt } from "../services/attemptService";
import { fetchExamQuestions } from "../services/questionService";
import AppLayout from "../layouts/AppLayout";
import Card from "../ui/Card";
import Button from "../ui/Button";
import {
  Trophy,
  Clock,
  ListChecks,
  CheckCircle,
  XCircle,
} from "lucide-react";

const ExamResult = () => {
  const { examId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [attempt, setAttempt] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const load = async () => {
      try {
        const latest = await fetchLatestAttempt(user.uid, examId);
        if (!latest) {
          navigate("/");
          return;
        }

        const qs = await fetchExamQuestions(examId);

        setAttempt(latest);
        setQuestions(qs);
      } catch (err) {
        console.error("Failed to load result:", err);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user, examId, navigate]);

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading result…
      </div>
    );
  }

  if (!attempt) return null;

  return (
    <AppLayout title="Exam Result">
      {/* SCORE HERO — TOP PRIORITY */}
      <Card className="rounded-3xl p-8 text-center space-y-4 border border-primary/20 bg-primary/5 animate-fade-in">
        <Trophy size={52} className="mx-auto text-primary" />

        <div className="space-y-1">
          <h2 className="text-4xl font-bold text-primary">
            {attempt.score}
            <span className="text-gray-400 text-xl">
              {" "}
              / {attempt.totalQuestions}
            </span>
          </h2>

          <p className="text-sm text-gray-600">
            Final Score
          </p>
        </div>

        <p className="text-gray-600">
          You’ve successfully completed this exam
        </p>
      </Card>

      {/* ATTEMPT SUMMARY */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <Card className="p-4 flex items-center gap-3 border border-gray-100">
          <Clock className="text-primary" />
          <div>
            <p className="text-sm text-gray-500">Time Taken</p>
            <p className="font-semibold text-gray-900">
              {Math.floor(attempt.durationTaken / 60)} min
            </p>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3 border border-gray-100">
          <ListChecks className="text-primary" />
          <div>
            <p className="text-sm text-gray-500">Questions</p>
            <p className="font-semibold text-gray-900">
              {attempt.totalQuestions}
            </p>
          </div>
        </Card>
      </div>

      {/* ANSWER KEY */}
      <div className="mt-8 space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Question-wise Review
        </h3>

        {questions.map((q, index) => {
          const userAns = attempt.answers[q.id];
          const isCorrect =
            userAns !== undefined &&
            userAns === q.correctOption;

          return (
            <Card
              key={q.id}
              className="p-5 space-y-3 border border-gray-100 animate-fade-in"
            >
              <div className="flex items-start gap-2 font-medium text-gray-900">
                {isCorrect ? (
                  <CheckCircle
                    size={20}
                    className="text-primary mt-0.5"
                  />
                ) : (
                  <XCircle
                    size={20}
                    className="text-red-500 mt-0.5"
                  />
                )}
                <span>
                  {index + 1}. {q.question}
                </span>
              </div>

              <div className="text-sm space-y-1 pl-7">
                <p>
                  <span className="text-gray-500">
                    Your answer:
                  </span>{" "}
                  {userAns === undefined
                    ? "Not answered"
                    : q.options[userAns]}
                </p>

                <p>
                  <span className="text-gray-500">
                    Correct answer:
                  </span>{" "}
                  {q.options[q.correctOption]}
                </p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* EXIT ACTION */}
      <div className="mt-10 flex justify-end">
        <Button onClick={() => navigate("/")}>
          Back to Dashboard
        </Button>
      </div>
    </AppLayout>
  );
};

export default ExamResult;
