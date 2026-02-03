import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebase";

export const fetchAllUsers = async () => {
  const snap = await getDocs(collection(db, "users"));
  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
};

export const toggleUserBlock = async (userId, blocked) => {
  await updateDoc(doc(db, "users", userId), {
    blocked,
  });
};
