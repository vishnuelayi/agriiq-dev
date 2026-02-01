import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { Info, AlertTriangle, CheckCircle } from "lucide-react";

const styles = {
  info: {
    bg: "bg-blue-50",
    text: "text-blue-900",
    icon: <Info className="text-blue-600" />,
  },
  warning: {
    bg: "bg-yellow-50",
    text: "text-yellow-900",
    icon: <AlertTriangle className="text-yellow-600" />,
  },
  success: {
    bg: "bg-green-50",
    text: "text-green-900",
    icon: <CheckCircle className="text-green-600" />,
  },
};

const AnnouncementBanner = () => {
  const [announcement, setAnnouncement] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const snap = await getDoc(
          doc(db, "settings", "announcement")
        );
        if (snap.exists()) {
          setAnnouncement(snap.data());
        }
      } catch (err) {
        console.error("Failed to load announcement:", err);
      }
    };

    load();
  }, []);

  if (!announcement || !announcement.enabled) return null;

  const theme = styles[announcement.type || "info"];

  return (
    <div
      className={`${theme.bg} ${theme.text} border border-black/5 rounded-2xl p-4 flex items-center gap-3 animate-fade-in`}
    >
      <div className="mt-0.5">{theme.icon}</div>
      <p className="text-sm font-medium">
        {announcement.message}
      </p>
    </div>
  );
};

export default AnnouncementBanner;
