import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";

import AdminLayout from "../AdminLayout";
import Card from "../../ui/Card";
import Button from "../../ui/Button";
import SkeletonCard from "../../ui/SkeletonCard";
import { Clock, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

const AdminPayments = () => {
  const [loading, setLoading] = useState(true);

  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState([]);
  const [rejected, setRejected] = useState([]);

  const [userPhones, setUserPhones] = useState({});
  const [examTitles, setExamTitles] = useState({});

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      setLoading(true);

      const snap = await getDocs(collection(db, "payments"));
      const allPayments = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      setPending(allPayments.filter((p) => p.status === "pending"));
      setApproved(allPayments.filter((p) => p.status === "approved"));
      setRejected(allPayments.filter((p) => p.status === "rejected"));

      /* ---------- FETCH USER PHONES ---------- */
      const uniqueUserIds = [...new Set(allPayments.map((p) => p.userId))];
      const phoneMap = {};

      await Promise.all(
        uniqueUserIds.map(async (uid) => {
          const userSnap = await getDoc(doc(db, "users", uid));
          if (userSnap.exists()) {
            phoneMap[uid] = userSnap.data().phone;
          }
        })
      );

      setUserPhones(phoneMap);

      /* ---------- FETCH EXAM TITLES ---------- */
      const uniqueExamIds = [...new Set(allPayments.map((p) => p.examId))];
      const examMap = {};

      await Promise.all(
        uniqueExamIds.map(async (eid) => {
          const examSnap = await getDoc(doc(db, "exams", eid));
          if (examSnap.exists()) {
            examMap[eid] = examSnap.data().title;
          }
        })
      );

      setExamTitles(examMap);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (payment, status) => {
    try {
      await updateDoc(doc(db, "payments", payment.id), {
        status,
        updatedAt: serverTimestamp(),
      });

      if (status === "approved") {
        await setDoc(
          doc(db, "userExams", `${payment.userId}_${payment.examId}`),
          {
            userId: payment.userId,
            examId: payment.examId,
            status: "unlocked",
            unlockedAt: serverTimestamp(),
          }
        );
      }

      toast.success(`Payment ${status}`);
      loadPayments();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update payment");
    }
  };

  return (
    <AdminLayout title="Payments">
      {/* ================= PENDING ================= */}
      <Section title="Pending Payments">
        {loading &&
          Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}

        {!loading && pending.length === 0 && (
          <Card>
            <p className="text-sm text-gray-500">No pending payments 🎉</p>
          </Card>
        )}

        {!loading &&
          pending.map((p) => (
            <PaymentCard
              key={p.id}
              payment={p}
              phone={userPhones[p.userId]}
              examTitle={examTitles[p.examId]}
              icon={<Clock className="text-orange-500" />}
              actions={
                <>
                  <Button size="sm" onClick={() => updateStatus(p, "approved")}>
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => updateStatus(p, "rejected")}
                  >
                    Reject
                  </Button>
                </>
              }
            />
          ))}
      </Section>

      {/* ================= APPROVED ================= */}
      <Collapsible title="Approved Payments">
        {loading
          ? Array.from({ length: 2 }).map((_, i) => <SkeletonCard key={i} />)
          : approved.map((p) => (
              <PaymentCard
                key={p.id}
                payment={p}
                phone={userPhones[p.userId]}
                examTitle={examTitles[p.examId]}
                icon={<CheckCircle className="text-green-600" />}
              />
            ))}
      </Collapsible>

      {/* ================= REJECTED ================= */}
      <Collapsible title="Rejected Payments">
        {loading
          ? Array.from({ length: 2 }).map((_, i) => <SkeletonCard key={i} />)
          : rejected.map((p) => (
              <PaymentCard
                key={p.id}
                payment={p}
                phone={userPhones[p.userId]}
                examTitle={examTitles[p.examId]}
                icon={<XCircle className="text-red-600" />}
              />
            ))}
      </Collapsible>
    </AdminLayout>
  );
};

export default AdminPayments;

/* ================= SECTION ================= */

const Section = ({ title, children }) => (
  <section className="space-y-3 mb-6">
    <h2 className="text-sm font-semibold text-gray-700">{title}</h2>
    {children}
  </section>
);

/* ================= PAYMENT CARD ================= */

const PaymentCard = ({ payment, phone, examTitle, icon, actions }) => {
  return (
    <Card className="space-y-2 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <p className="font-medium text-sm">₹{payment.amount}</p>
        </div>
        <span className="text-xs text-gray-500 capitalize">
          {payment.status}
        </span>
      </div>

      <div className="text-xs text-gray-700 font-medium">
        Exam: <span className="text-gray-900">{examTitle || "—"}</span>
      </div>

      <div className="text-xs text-gray-500">
        Txn ID: {payment.transactionId}
      </div>

      <div className="text-xs text-gray-600">
        Phone: <span className="font-medium">{phone || "—"}</span>
      </div>

      {actions && <div className="flex gap-2 pt-2">{actions}</div>}
    </Card>
  );
};

/* ================= COLLAPSIBLE ================= */

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
