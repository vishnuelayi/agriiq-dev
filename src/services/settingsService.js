import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebase";

/* ---------------- PAYMENT ---------------- */
export const fetchPaymentSettings = async () => {
  const ref = doc(db, "settings", "payment");
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
};

export const savePaymentSettings = async (data) => {
  await setDoc(
    doc(db, "settings", "payment"),
    {
      ...data,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
};

/* ---------------- ANNOUNCEMENT ---------------- */
export const fetchAnnouncement = async () => {
  const ref = doc(db, "settings", "announcement");
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
};

export const saveAnnouncement = async (data) => {
  await setDoc(
    doc(db, "settings", "announcement"),
    {
      ...data,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
};
