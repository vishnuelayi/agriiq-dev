import { Routes, Route } from "react-router-dom";
import AdminDashboard from "../admin/pages/AdminDashboard";
import AdminExams from "../admin/pages/AdminExams";
import AdminPayments from "../admin/pages/AdminPayments";
import AdminUsers from "../admin/pages/AdminUsers";
import AdminSettings from "../admin/pages/AdminSettings";


const AdminRoutes = () => {
  return (
    <Routes>
      <Route index element={<AdminDashboard />} />
      <Route path="exams" element={<AdminExams />} />
      <Route path="payments" element={<AdminPayments />} />
      <Route path="users" element={<AdminUsers />} />
      <Route path="settings" element={<AdminSettings />} />
    </Routes>
  );
};

export default AdminRoutes;
