import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";

import AdminLayout from "../AdminLayout";
import AdminExamCard from "../components/AdminExamCard";
import SkeletonCard from "../../ui/SkeletonCard";
import Button from "../../ui/Button";
import { toast } from "sonner";

const AdminExams = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [drafts, setDrafts] = useState([]);
  const [published, setPublished] = useState([]);
  const [archived, setArchived] = useState([]);

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    try {
      setLoading(true);

      const snap = await getDocs(collection(db, "exams"));
      const exams = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      setDrafts(exams.filter((e) => e.status === "draft"));
      setPublished(exams.filter((e) => e.status === "published"));
      setArchived(exams.filter((e) => e.status === "archived"));
    } catch (err) {
      console.error(err);
      toast.error("Failed to load exams");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (examId, status) => {
    try {
      await updateDoc(doc(db, "exams", examId), { status });
      toast.success(`Exam ${status}`);
      loadExams();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update exam");
    }
  };

  return (
    <AdminLayout
      title="Exams"
      actions={
        <Button onClick={() => navigate("/admin/exams/new")}>
          + Create Exam
        </Button>
      }
    >
      {/* ================= PUBLISHED ================= */}
      <Section title="Published Exams">
        {loading &&
          Array.from({ length: 2 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}

        {!loading && published.length === 0 && (
          <Empty text="No published exams" />
        )}

        {!loading &&
          published.map((exam) => (
            <AdminExamCard
              key={exam.id}
              exam={exam}
              actions={[
                {
                  label: "Manage Questions",
                  onClick: () =>
                    navigate(`/admin/exams/${exam.id}/questions`),
                },
                {
                  label: "Archive",
                  variant: "danger",
                  onClick: () =>
                    updateStatus(exam.id, "archived"),
                },
              ]}
            />
          ))}
      </Section>

      {/* ================= DRAFTS ================= */}
      <Section title="Draft Exams">
        {loading &&
          Array.from({ length: 2 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}

        {!loading && drafts.length === 0 && (
          <Empty text="No draft exams" />
        )}

        {!loading &&
          drafts.map((exam) => (
            <AdminExamCard
              key={exam.id}
              exam={exam}
              actions={[
                {
                  label: "Edit",
                  onClick: () =>
                    navigate(`/admin/exams/${exam.id}/edit`),
                },
                {
                  label: "Publish",
                  onClick: () =>
                    updateStatus(exam.id, "published"),
                },
              ]}
            />
          ))}
      </Section>

      {/* ================= ARCHIVED ================= */}
      <Collapsible title="Archived Exams">
        {loading &&
          Array.from({ length: 2 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}

        {!loading &&
          archived.map((exam) => (
            <AdminExamCard
              key={exam.id}
              exam={exam}
              actions={[
                {
                  label: "Restore",
                  onClick: () =>
                    updateStatus(exam.id, "draft"),
                },
              ]}
            />
          ))}
      </Collapsible>
    </AdminLayout>
  );
};

export default AdminExams;

/* ================= HELPERS ================= */

const Section = ({ title, children }) => (
  <section className="space-y-3 mb-6">
    <h2 className="text-sm font-semibold text-gray-700">
      {title}
    </h2>
    {children}
  </section>
);

const Empty = ({ text }) => (
  <div className="text-sm text-gray-500 bg-white p-4 rounded-xl border">
    {text}
  </div>
);

const Collapsible = ({ title, children }) => {
  const [open, setOpen] = useState(false);

  if (!children || children.length === 0) return null;

  return (
    <section className="mb-6">
      <button
        onClick={() => setOpen(!open)}
        className="text-sm font-semibold text-gray-700 mb-2"
      >
        {title} {open ? "▲" : "▼"}
      </button>

      {open && <div className="space-y-3">{children}</div>}
    </section>
  );
};
