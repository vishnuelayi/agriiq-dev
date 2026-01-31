import { Routes, Route } from "react-router-dom";
import AdminDashboard from "../admin/AdminDashboard";
import CreateExam from "../admin/CreateExam";
import ManageQuestions from "../admin/ManageQuestions";
import AdminExamPreview from "../admin/AdminExamPreview";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/exams/create" element={<CreateExam />} />
      <Route path="/exams/:examId/questions" element={<ManageQuestions />} />
      <Route path="/exams/:examId/preview" element={<AdminExamPreview />} />
    </Routes>
  );
};

export default AdminRoutes;
