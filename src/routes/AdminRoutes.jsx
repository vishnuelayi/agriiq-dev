import { Routes, Route } from "react-router-dom";

import AdminDashboard from "../admin/pages/AdminDashboard";
import AdminExams from "../admin/pages/AdminExams";
import CreateExam from "../admin/pages/CreateExam";
import ManageQuestions from "../admin/pages/ManageQuestions";
import AdminPayments from "../admin/pages/AdminPayments";
import EditExam from "../admin/pages/EditExam";
import AdminUsers from "../admin/pages/AdminUsers";
import AdminSettings from "../admin/pages/AdminSettings";

const AdminRoutes = () => {
  return (
    <Routes>
      {/* DASHBOARD */}
      <Route path="/" element={<AdminDashboard />} />

      {/* EXAMS */}
      <Route path="/exams" element={<AdminExams />} />
      <Route path="/exams/new" element={<CreateExam />} />
      <Route path="/exams/:examId/questions" element={<ManageQuestions />} />

      {/* PAYMENTS */}
      <Route path="/payments" element={<AdminPayments />} />

      <Route path="/exams/:examId/edit" element={<EditExam />} />
      <Route path="/users" element={<AdminUsers />} />
      <Route path="/settings" element={<AdminSettings />} />
    </Routes>
  );
};

export default AdminRoutes;
