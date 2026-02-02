import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";

import AdminLayout from "../AdminLayout";
import Card from "../../ui/Card";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import SkeletonCard from "../../ui/SkeletonCard";
import { toast } from "sonner";

const ManageQuestions = () => {
  const { examId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    question: "",
    options: ["", "", "", ""],
    correctOption: 0,
  });

  useEffect(() => {
    loadQuestions();
  }, [examId]);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const q = query(
        collection(db, "questions"),
        where("examId", "==", examId)
      );
      const snap = await getDocs(q);

      setQuestions(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }))
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to load questions");
    } finally {
      setLoading(false);
    }
  };

  const updateOption = (index, value) => {
    const updated = [...form.options];
    updated[index] = value;
    setForm((f) => ({ ...f, options: updated }));
  };

  const addQuestion = async () => {
    if (!form.question.trim()) {
      toast.error("Question text is required");
      return;
    }

    if (form.options.some((o) => !o.trim())) {
      toast.error("All options are required");
      return;
    }

    setSaving(true);

    try {
      await addDoc(collection(db, "questions"), {
        examId,
        question: form.question.trim(),
        options: form.options,
        correctOption: form.correctOption,
        createdAt: serverTimestamp(),
      });

      toast.success("Question added");

      setForm({
        question: "",
        options: ["", "", "", ""],
        correctOption: 0,
      });

      loadQuestions();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add question");
    } finally {
      setSaving(false);
    }
  };

  const removeQuestion = async (id) => {
    if (!confirm("Delete this question?")) return;

    try {
      await deleteDoc(doc(db, "questions", id));
      toast.success("Question deleted");
      loadQuestions();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete question");
    }
  };

  return (
    <AdminLayout
      title="Manage Questions"
      actions={
        <Button
          variant="ghost"
          onClick={() => navigate("/admin/exams")}
        >
          Done
        </Button>
      }
    >
      {/* ================= ADD QUESTION ================= */}
      <Card className="space-y-4 mb-6">
        <Input
          label="Question"
          placeholder="Enter the question"
          value={form.question}
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              question: e.target.value,
            }))
          }
        />

        {form.options.map((opt, i) => (
          <div
            key={i}
            className="flex items-center gap-2"
          >
            <input
              type="radio"
              checked={form.correctOption === i}
              onChange={() =>
                setForm((f) => ({
                  ...f,
                  correctOption: i,
                }))
              }
            />

            <Input
              placeholder={`Option ${i + 1}`}
              value={opt}
              onChange={(e) =>
                updateOption(i, e.target.value)
              }
            />
          </div>
        ))}

        <Button onClick={addQuestion} disabled={saving}>
          {saving ? "Adding…" : "Add Question"}
        </Button>
      </Card>

      {/* ================= QUESTION LIST ================= */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-700">
          Existing Questions ({questions.length})
        </h2>

        {loading &&
          Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}

        {!loading && questions.length === 0 && (
          <Card>
            <p className="text-sm text-gray-500">
              No questions added yet
            </p>
          </Card>
        )}

        {!loading &&
          questions.map((q, idx) => (
            <Card
              key={q.id}
              className="space-y-2"
            >
              <p className="font-medium text-sm">
                {idx + 1}. {q.question}
              </p>

              <ul className="text-xs text-gray-600 space-y-1">
                {q.options.map((o, i) => (
                  <li
                    key={i}
                    className={
                      i === q.correctOption
                        ? "text-green-600 font-medium"
                        : ""
                    }
                  >
                    {o}
                  </li>
                ))}
              </ul>

              <Button
                size="sm"
                variant="danger"
                onClick={() => removeQuestion(q.id)}
              >
                Delete
              </Button>
            </Card>
          ))}
      </section>
    </AdminLayout>
  );
};

export default ManageQuestions;
