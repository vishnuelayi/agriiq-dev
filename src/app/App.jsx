import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../auth/AuthContext";
import UserRoutes from "../routes/UserRoutes";
import AdminRoutes from "../routes/AdminRoutes";
import ProtectedRoute from "../routes/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
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
