import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase";

export const fetchExamQuestions = async (examId) => {
  const q = query(
    collection(db, "questions"),
    where("examId", "==", examId)
  );

  const snap = await getDocs(q);

  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};
