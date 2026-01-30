import {
    collection,
    getDocs,
    query,
    where,
    orderBy,
    limit,
  } from "firebase/firestore";
  import { db } from "../firebase/firebase";
  
  export const fetchLatestAttempt = async (userId, examId) => {
    const q = query(
      collection(db, "attempts"),
      where("userId", "==", userId),
      where("examId", "==", examId),
      orderBy("submittedAt", "desc"),
      limit(1)
    );
  
    const snap = await getDocs(q);
    if (snap.empty) return null;
  
    return snap.docs[0].data();
  };
  