import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

export const fetchExamQuestions = async (examId) => {
  const ref = collection(db, "questions", examId, "items");
  const snap = await getDocs(ref);

  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};
