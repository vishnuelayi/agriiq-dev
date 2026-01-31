import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

const AdminExamPreview = () => {
  const { examId } = useParams();
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const load = async () => {
      const snap = await getDocs(
        collection(db, "questions", examId, "items")
      );
      setQuestions(snap.docs.map((d) => d.data()));
    };
    load();
  }, [examId]);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-lg font-bold">Exam Preview</h1>

      {questions.map((q, i) => (
        <div key={i} className="border p-3 rounded">
          <div className="font-semibold">
            {i + 1}. {q.question}
          </div>
          <ul>
            {q.options.map((opt, idx) => (
              <li key={idx}>
                {idx === q.correctOption ? "✔ " : ""}
                {opt}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default AdminExamPreview;
