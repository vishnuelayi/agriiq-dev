import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase";

export const fetchUserExams = async (userId) => {
  const q = query(
    collection(db, "userExams"),
    where("userId", "==", userId)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => doc.data().examId);
};
