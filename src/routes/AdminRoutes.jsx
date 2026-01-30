import { Routes, Route } from "react-router-dom";
import AdminDashboard from "../admin/AdminDashboard";
import CreateExam from "../admin/CreateExam";
import ManageQuestions from "../admin/ManageQuestions";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/exams/create" element={<CreateExam />} />
      <Route path="/exams/:examId/questions" element={<ManageQuestions />} />
    </Routes>
  );
};

export default AdminRoutes;
