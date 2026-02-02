import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { Menu, LogOut } from "lucide-react";

import AdminDrawer from "./AdminDrawer";
import AdminBottomNav from "./AdminBottomNav";

const AdminLayout = ({ title, children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* TOP BAR */}
      <header className="h-14 bg-white border-b flex items-center justify-between px-4">
        <button onClick={() => setDrawerOpen(true)}>
          <Menu />
        </button>

        <h1 className="text-base font-semibold text-gray-900">
          {title}
        </h1>

        <button
          onClick={handleLogout}
          className="text-red-600"
        >
          <LogOut size={18} />
        </button>
      </header>

      {/* DRAWER */}
      <AdminDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />

      {/* CONTENT */}
      <main className="p-4">
        {children}
      </main>

      {/* BOTTOM NAV */}
      <AdminBottomNav />
    </div>
  );
};

export default AdminLayout;
