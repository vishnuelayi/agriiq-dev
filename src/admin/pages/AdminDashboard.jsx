import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";

import AdminLayout from "../AdminLayout";
import Card from "../../ui/Card";
import Button from "../../ui/Button";
import {
  AlertTriangle,
  CreditCard,
  FileText,
  Users,
  IndianRupee,
  ArrowRight,
} from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [pendingPayments, setPendingPayments] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [examCount, setExamCount] = useState(0);
  const [userCount, setUserCount] = useState(0);

  const [recentPayments, setRecentPayments] = useState([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);

        /* ---------- Pending Payments ---------- */
        const pendingSnap = await getDocs(
          query(
            collection(db, "payments"),
            where("status", "==", "pending")
          )
        );
        setPendingPayments(pendingSnap.size);

        /* ---------- Revenue ---------- */
        const approvedSnap = await getDocs(
          query(
            collection(db, "payments"),
            where("status", "==", "approved")
          )
        );

        let total = 0;
        approvedSnap.forEach((doc) => {
          total += doc.data().amount || 0;
        });
        setRevenue(total);

        /* ---------- Exams ---------- */
        const examsSnap = await getDocs(collection(db, "exams"));
        setExamCount(examsSnap.size);

        /* ---------- Users ---------- */
        const usersSnap = await getDocs(collection(db, "users"));
        setUserCount(usersSnap.size);

        /* ---------- Recent Payments ---------- */
        const recentSnap = await getDocs(
          query(
            collection(db, "payments"),
            orderBy("createdAt", "desc"),
            limit(5)
          )
        );

        setRecentPayments(
          recentSnap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          }))
        );
      } catch (err) {
        console.error("Failed to load admin dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  return (
    <AdminLayout title="Dashboard">
      {/* ================= ALERTS ================= */}
      <section className="space-y-4 mb-6">
        {pendingPayments > 0 && (
          <Card className="border-l-4 border-red-500 bg-red-50">
            <div className="flex items-center gap-3">
              <AlertTriangle className="text-red-600" />
              <div className="flex-1">
                <p className="font-semibold text-red-700">
                  {pendingPayments} payment(s) pending approval
                </p>
                <p className="text-sm text-red-600">
                  Review payments to unlock exams for students
                </p>
              </div>
              <Button
                size="sm"
                onClick={() => navigate("/admin/payments")}
              >
                Review
              </Button>
            </div>
          </Card>
        )}

        {pendingPayments === 0 && (
          <Card className="bg-green-50 border border-green-200">
            <p className="text-green-700 font-medium">
              ✅ No pending payments
            </p>
          </Card>
        )}
      </section>

      {/* ================= METRICS ================= */}
      <section className="grid grid-cols-2 gap-4 mb-6">
        <MetricCard
          label="Revenue"
          value={`₹${revenue}`}
          icon={IndianRupee}
        />
        <MetricCard
          label="Exams"
          value={examCount}
          icon={FileText}
        />
        <MetricCard
          label="Users"
          value={userCount}
          icon={Users}
        />
        <MetricCard
          label="Pending"
          value={pendingPayments}
          icon={CreditCard}
        />
      </section>

      {/* ================= RECENT ACTIVITY ================= */}
      <section className="space-y-3 mb-6">
        <h2 className="text-sm font-semibold text-gray-700">
          Recent Payments
        </h2>

        {recentPayments.length === 0 && (
          <Card>
            <p className="text-sm text-gray-500">
              No recent activity
            </p>
          </Card>
        )}

        {recentPayments.map((p) => (
          <Card
            key={p.id}
            className="flex items-center justify-between"
          >
            <div>
              <p className="text-sm font-medium">
                ₹{p.amount} — {p.status}
              </p>
              <p className="text-xs text-gray-500">
                Txn: {p.transactionId}
              </p>
            </div>
            <ArrowRight className="text-gray-400" />
          </Card>
        ))}
      </section>

      {/* ================= QUICK ACTIONS ================= */}
      <section className="grid grid-cols-2 gap-4">
        <Button onClick={() => navigate("/admin/exams")}>
          Manage Exams
        </Button>

        <Button
          variant="secondary"
          onClick={() => navigate("/admin/settings")}
        >
          Announcements
        </Button>
      </section>
    </AdminLayout>
  );
};

export default AdminDashboard;

/* ---------- Metric Card ---------- */
const MetricCard = ({ label, value, icon: Icon }) => {
  return (
    <Card className="flex items-center gap-4">
      <div className="p-3 rounded-xl bg-green-100 text-green-700">
        <Icon size={20} />
      </div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-lg font-semibold">{value}</p>
      </div>
    </Card>
  );
};
