import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase";

export const fetchPublishedExams = async () => {
  const q = query(
    collection(db, "exams"),
    where("status", "==", "published")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};
