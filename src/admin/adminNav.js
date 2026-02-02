import {
    LayoutDashboard,
    FileText,
    CreditCard,
    Users,
    Settings,
  } from "lucide-react";
  
  export const adminNav = [
    { label: "Dashboard", to: "/admin", icon: LayoutDashboard },
    { label: "Exams", to: "/admin/exams", icon: FileText },
    { label: "Payments", to: "/admin/payments", icon: CreditCard },
    { label: "Users", to: "/admin/users", icon: Users },
    { label: "Settings", to: "/admin/settings", icon: Settings },
  ];
  