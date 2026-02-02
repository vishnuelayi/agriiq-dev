import { NavLink } from "react-router-dom";
import { adminNav } from "./adminNav";
import { X } from "lucide-react";

const AdminDrawer = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* BACKDROP */}
      <div
        className="flex-1 bg-black/40"
        onClick={onClose}
      />

      {/* DRAWER */}
      <aside className="w-64 bg-white h-full p-4 animate-slide-in-left">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-primary">
            AgriIQ Admin
          </h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <nav className="space-y-2">
          {adminNav.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                ${
                  isActive
                    ? "bg-green-100 text-green-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </div>
  );
};

export default AdminDrawer;
