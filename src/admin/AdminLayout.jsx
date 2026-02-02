import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { Menu, LogOut } from "lucide-react";

import AdminDrawer from "./AdminDrawer";
import AdminBottomNav from "./AdminBottomNav";

const AdminLayout = ({ title, actions, children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* TOP BAR */}
      <header className="h-14 bg-white border-b flex items-center justify-between px-4">
        {/* LEFT */}
        <button onClick={() => setDrawerOpen(true)}>
          <Menu />
        </button>

        {/* CENTER */}
        <h1 className="text-base font-semibold text-gray-900 truncate">
          {title}
        </h1>

        {/* RIGHT */}
        <div className="flex items-center gap-2">
          {actions}
          <button
            onClick={handleLogout}
            className="text-red-600"
          >
            <LogOut size={18} />
          </button>
        </div>
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
