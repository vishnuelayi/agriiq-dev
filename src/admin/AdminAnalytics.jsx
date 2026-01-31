import { useEffect, useState } from "react";
import {
  fetchTotalUsers,
  fetchTotalExams,
  fetchTotalAttempts,
  fetchExamStats,
  fetchTotalRevenue,
  fetchRevenuePerExam,
} from "../services/adminAnalyticsService";

const AdminAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [examStats, setExamStats] = useState([]);
  const [loading, setLoading] = useState(true);

  const [totalRevenue, setTotalRevenue] = useState(0);
  const [revenueMap, setRevenueMap] = useState({});

  useEffect(() => {
    const load = async () => {
      try {
        const [users, exams, attempts, perExam, revenue, revenueByExam] =
          await Promise.all([
            fetchTotalUsers(),
            fetchTotalExams(),
            fetchTotalAttempts(),
            fetchExamStats(),
            fetchTotalRevenue(),
            fetchRevenuePerExam(),
          ]);

        setStats({ users, exams, attempts });
        setExamStats(perExam);
        setTotalRevenue(revenue);
        setRevenueMap(revenueByExam);
      } catch (err) {
        console.error("Failed to load analytics:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) return <div className="p-4">Loading analytics...</div>;

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-xl font-bold">Admin Analytics</h1>

      {/* SUMMARY */}
      <div className="space-y-2">
        <div>Total Users: {stats.users}</div>
        <div>Total Exams: {stats.exams}</div>
        <div>Total Attempts: {stats.attempts}</div>
        <div>Total Revenue: ₹{totalRevenue}</div>
      </div>

      {/* PER EXAM */}
      <div className="space-y-3">
        <h2 className="font-semibold">Exam Performance</h2>

        {examStats.map((e) => (
          <div key={e.examId} className="border p-3 rounded">
            <div className="font-medium">{e.title}</div>
            <div>Attempts: {e.attempts}</div>
            <div>Average Score: {e.averageScore}</div>
            <div>Revenue: ₹{revenueMap[e.examId] || 0}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminAnalytics;
