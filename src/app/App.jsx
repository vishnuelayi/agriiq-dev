import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../auth/AuthContext";
import UserRoutes from "../routes/UserRoutes";
import AdminRoutes from "../routes/AdminRoutes";
import ProtectedRoute from "../routes/ProtectedRoute";
import { Toaster } from "sonner";

function App() {
  return (
    <AuthProvider>
      {/* ✅ Global toast container */}
      <Toaster position="top-center" richColors closeButton />

      <BrowserRouter>
        <Routes>
          {/* USER ROUTES */}
          <Route path="/*" element={<UserRoutes />} />

          {/* ADMIN ROUTES */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute adminOnly>
                <AdminRoutes />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
