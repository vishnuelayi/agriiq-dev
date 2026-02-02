import { NavLink } from "react-router-dom";
import { adminNav } from "./adminNav";

const AdminBottomNav = () => {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white border-t flex justify-around md:hidden">
      {adminNav.slice(0, 4).map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end
          className={({ isActive }) =>
            `flex flex-col items-center py-2 text-xs
            ${
              isActive
                ? "text-green-600"
                : "text-gray-500"
            }`
          }
        >
          <Icon size={20} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
};

export default AdminBottomNav;
