import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

export const fetchPublishedExams = async () => {
  const examsSnap = await getDocs(collection(db, "exams"));

  const exams = examsSnap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter((e) => e.status === "published");

  // 🔹 Attach question count dynamically
  const examsWithCounts = await Promise.all(
    exams.map(async (exam) => {
      const qSnap = await getDocs(
        collection(db, "questions", exam.id, "items")
      );

      return {
        ...exam,
        questionCount: qSnap.size,
      };
    })
  );

  return examsWithCounts;
};
