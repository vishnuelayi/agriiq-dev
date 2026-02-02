import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase";

export const fetchPublishedExams = async () => {
  const examsSnap = await getDocs(collection(db, "exams"));

  const exams = examsSnap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter((e) => e.status === "published");

  // 🔹 Attach question count dynamically (flat schema)
  const examsWithCounts = await Promise.all(
    exams.map(async (exam) => {
      const q = query(
        collection(db, "questions"),
        where("examId", "==", exam.id)
      );

      const qSnap = await getDocs(q);

      return {
        ...exam,
        questionCount: qSnap.size,
      };
    })
  );

  return examsWithCounts;
};
