import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";

import AdminLayout from "../AdminLayout";
import Card from "../../ui/Card";
import Input from "../../ui/Input";
import Button from "../../ui/Button";
import SkeletonCard from "../../ui/SkeletonCard";
import { toast } from "sonner";

const EditExam = () => {
  const { examId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    duration: "",
    maxReattempts: 1,
  });

  useEffect(() => {
    loadExam();
  }, [examId]);

  const loadExam = async () => {
    try {
      const snap = await getDoc(doc(db, "exams", examId));

      if (!snap.exists()) {
        toast.error("Exam not found");
        navigate("/admin/exams");
        return;
      }

      const data = snap.data();

      setForm({
        title: data.title || "",
        description: data.description || "",
        price: data.price || "",
        duration: data.duration || "",
        maxReattempts: data.maxReattempts || 1,
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to load exam");
      navigate("/admin/exams");
    } finally {
      setLoading(false);
    }
  };

  const update = (k, v) =>
    setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }

    setSaving(true);

    try {
      await updateDoc(doc(db, "exams", examId), {
        title: form.title.trim(),
        description: form.description.trim(),
        price: Number(form.price) || 0,
        duration: Number(form.duration) || 0,
        maxReattempts: Number(form.maxReattempts) || 1,
        updatedAt: serverTimestamp(),
      });

      toast.success("Exam updated");
      navigate("/admin/exams");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update exam");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Edit Exam">
        <SkeletonCard />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Edit Exam">
      <Card className="space-y-5 max-w-xl mx-auto">
        <Input
          label="Exam Title"
          value={form.title}
          onChange={(e) =>
            update("title", e.target.value)
          }
        />

        <Input
          label="Description"
          value={form.description}
          onChange={(e) =>
            update("description", e.target.value)
          }
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Price (₹)"
            type="number"
            value={form.price}
            onChange={(e) =>
              update("price", e.target.value)
            }
          />

          <Input
            label="Duration (minutes)"
            type="number"
            value={form.duration}
            onChange={(e) =>
              update("duration", e.target.value)
            }
          />
        </div>

        <Input
          label="Max Reattempts"
          type="number"
          min={1}
          value={form.maxReattempts}
          onChange={(e) =>
            update("maxReattempts", e.target.value)
          }
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button
            variant="ghost"
            onClick={() => navigate("/admin/exams")}
            disabled={saving}
          >
            Cancel
          </Button>

          <Button onClick={save} disabled={saving}>
            {saving ? "Saving…" : "Save Changes"}
          </Button>
        </div>
      </Card>
    </AdminLayout>
  );
};

export default EditExam;
