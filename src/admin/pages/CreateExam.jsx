import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";

import AdminLayout from "../AdminLayout";
import Card from "../../ui/Card";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import { toast } from "sonner";

const CreateExam = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    duration: "",
    maxReattempts: 1,
  });

  const [saving, setSaving] = useState(false);

  const update = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const handleCreate = async () => {
    if (!form.title.trim()) {
      toast.error("Exam title is required");
      return;
    }

    setSaving(true);

    try {
      const docRef = await addDoc(collection(db, "exams"), {
        title: form.title.trim(),
        description: form.description.trim(),
        price: Number(form.price) || 0,
        duration: Number(form.duration) || 0,
        maxReattempts: Number(form.maxReattempts) || 1,
        status: "draft",
        createdAt: serverTimestamp(),
      });

      toast.success("Exam created as draft");

      navigate(`/admin/exams/${docRef.id}/questions`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create exam");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout title="Create Exam">
      <Card className="space-y-5 max-w-xl mx-auto">
        {/* TITLE */}
        <Input
          label="Exam Title"
          placeholder="Eg: Irrigation Mock Test"
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
        />

        {/* DESCRIPTION */}
        <Input
          label="Description"
          placeholder="Short description for students"
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
        />

        {/* PRICE & DURATION */}
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Price (₹)"
            type="number"
            placeholder="199"
            value={form.price}
            onChange={(e) => update("price", e.target.value)}
          />

          <Input
            label="Duration (minutes)"
            type="number"
            placeholder="60"
            value={form.duration}
            onChange={(e) => update("duration", e.target.value)}
          />
        </div>

        {/* REATTEMPTS */}
        <Input
          label="Max Reattempts"
          type="number"
          min={1}
          value={form.maxReattempts}
          onChange={(e) =>
            update("maxReattempts", e.target.value)
          }
        />

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 pt-2">
          <Button
            variant="ghost"
            onClick={() => navigate("/admin/exams")}
            disabled={saving}
          >
            Cancel
          </Button>

          <Button onClick={handleCreate} disabled={saving}>
            {saving ? "Creating…" : "Create & Add Questions"}
          </Button>
        </div>
      </Card>
    </AdminLayout>
  );
};

export default CreateExam;
