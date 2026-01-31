import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

const ManageQuestions = () => {
  const { examId } = useParams();

  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctOption, setCorrectOption] = useState(0);
  const [questions, setQuestions] = useState([]);

  const navigate = useNavigate();

  /* ---------- LOAD QUESTIONS ---------- */
  useEffect(() => {
    const loadQuestions = async () => {
      const snap = await getDocs(collection(db, "questions", examId, "items"));

      setQuestions(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })),
      );
    };

    loadQuestions();
  }, [examId]);

  /* ---------- ADD QUESTION ---------- */
  const addQuestion = async () => {
    if (!question || options.some((o) => !o)) return;

    const ref = await addDoc(collection(db, "questions", examId, "items"), {
      question,
      options,
      correctOption,
    });

    setQuestions((prev) => [
      ...prev,
      { id: ref.id, question, options, correctOption },
    ]);

    setQuestion("");
    setOptions(["", "", "", ""]);
    setCorrectOption(0);
  };

  /* ---------- DELETE QUESTION ---------- */
  const deleteQuestion = async (id) => {
    await deleteDoc(doc(db, "questions", examId, "items", id));
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-lg font-bold">
        Manage Questions ({questions.length})
      </h2>

      {/* ADD QUESTION */}
      <div className="border p-3 space-y-2">
        <input
          placeholder="Question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        {options.map((opt, i) => (
          <input
            key={i}
            placeholder={`Option ${i + 1}`}
            value={opt}
            onChange={(e) => {
              const copy = [...options];
              copy[i] = e.target.value;
              setOptions(copy);
            }}
          />
        ))}

        <select
          value={correctOption}
          onChange={(e) => setCorrectOption(+e.target.value)}
        >
          <option value={0}>Option 1</option>
          <option value={1}>Option 2</option>
          <option value={2}>Option 3</option>
          <option value={3}>Option 4</option>
        </select>

        <button onClick={addQuestion}>Add Question</button>
      </div>

      {/* LIST QUESTIONS */}
      <div className="space-y-2">
        {questions.length === 0 && (
          <div className="text-gray-500">No questions added yet</div>
        )}

        {questions.map((q, i) => (
          <div key={q.id} className="border p-2 rounded">
            <div className="font-medium">
              {i + 1}. {q.question}
            </div>

            <ul className="ml-4">
              {q.options.map((opt, idx) => (
                <li key={idx}>
                  {idx === q.correctOption ? "✔ " : ""}
                  {opt}
                </li>
              ))}
            </ul>

            <button
              onClick={() => deleteQuestion(q.id)}
              className="text-red-600 text-sm mt-1"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t flex gap-3">
        <button
          onClick={() => {
            if (questions.length === 0) {
              const confirmLeave = window.confirm(
                "No questions added. Do you want to leave without adding questions?",
              );
              if (!confirmLeave) return;
            }
            navigate("/admin");
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Done & Go to Dashboard
        </button>

        <button
          onClick={() => {
            const confirmCancel = window.confirm(
              "Are you sure you want to cancel and go back? Any unsaved questions will be lost.",
            );
            if (!confirmCancel) return;
            navigate("/admin");
          }}
          className="bg-gray-400 text-white px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ManageQuestions;
