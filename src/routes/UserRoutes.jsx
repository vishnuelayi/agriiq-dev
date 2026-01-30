import { Routes, Route, Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import UserOtpLogin from "../auth/UserOtpLogin";
import UserDashboard from "../users/UserDashboard";
import ExamAttempt from "../exam/ExamAttempt";
import ExamResult from "../exam/ExamResult";

const UserRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) return null;

  // Not logged in → only login allowed
  if (!user) {
    return <UserOtpLogin />;
  }

  // Logged in → user routes
  return (
    <Routes>
      <Route path="/" element={<UserDashboard />} />
      <Route path="/exam/:examId" element={<ExamAttempt />} />
      <Route path="/results/:examId" element={<ExamResult />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>

  );
};

export default UserRoutes;
