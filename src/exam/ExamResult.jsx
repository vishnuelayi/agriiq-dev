import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { fetchLatestAttempt } from "../services/attemptService";
import { fetchExamQuestions } from "../services/questionService";

const ExamResult = () => {
    const { examId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [attempt, setAttempt] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return; // ⬅️ wait for auth

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

    if (loading) return <div className="p-4">Loading result...</div>;
    if (!attempt) return null;

    return (
        <div className="p-4 space-y-4">
            <h1 className="text-xl font-bold">Exam Result</h1>

            <div className="border p-4 rounded">
                <div>Total Questions: {attempt.totalQuestions}</div>
                <div>Score: {attempt.score}</div>
            </div>

            <h2 className="font-semibold mt-4">Question-wise Analysis</h2>

            {questions.map((q, index) => {
                const userAns = attempt.answers[q.id];

                return (
                    <div key={q.id} className="border p-3 rounded space-y-1">
                        <div className="font-medium">
                            {index + 1}. {q.question}
                        </div>

                        <div>
                            Your answer:{" "}
                            {userAns === undefined
                                ? "Not answered"
                                : q.options[userAns]}
                        </div>

                        <div>
                            Correct answer: {q.options[q.correctOption]}
                        </div>
                    </div>
                );
            })}

            <button
                onClick={() => navigate("/")}
                className="bg-blue-600 text-white px-4 py-2 rounded"
            >
                Back to Dashboard
            </button>
        </div>
    );
};

export default ExamResult;
