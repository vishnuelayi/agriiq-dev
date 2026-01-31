import {
    collection,
    getDocs,
    query,
    where,
  } from "firebase/firestore";
  import { db } from "../firebase/firebase";
  
  /* ---------- TOTAL COUNTS ---------- */
  
  export const fetchTotalUsers = async () => {
    const snap = await getDocs(collection(db, "users"));
    return snap.size;
  };
  
  export const fetchTotalExams = async () => {
    const snap = await getDocs(collection(db, "exams"));
    return snap.size;
  };
  
  export const fetchTotalAttempts = async () => {
    const snap = await getDocs(collection(db, "attempts"));
    return snap.size;
  };
  
  /* ---------- PER EXAM STATS ---------- */
  
  export const fetchExamStats = async () => {
    const examsSnap = await getDocs(collection(db, "exams"));
    const attemptsSnap = await getDocs(collection(db, "attempts"));
  
    const exams = examsSnap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));
  
    const attempts = attemptsSnap.docs.map((d) => d.data());
  
    return exams.map((exam) => {
      const examAttempts = attempts.filter(
        (a) => a.examId === exam.id
      );
  
      const avgScore =
        examAttempts.length === 0
          ? 0
          : examAttempts.reduce((s, a) => s + a.score, 0) /
            examAttempts.length;
  
      return {
        examId: exam.id,
        title: exam.title,
        attempts: examAttempts.length,
        averageScore: Number(avgScore.toFixed(2)),
      };
    });
  };


  /* ---------- REVENUE ANALYTICS ---------- */

export const fetchTotalRevenue = async () => {
    const snap = await getDocs(
      query(
        collection(db, "payments"),
        where("status", "==", "approved")
      )
    );
  
    return snap.docs.reduce(
      (sum, d) => sum + (d.data().amount || 0),
      0
    );
  };
  
  export const fetchRevenuePerExam = async () => {
    const paymentsSnap = await getDocs(
      query(
        collection(db, "payments"),
        where("status", "==", "approved")
      )
    );
  
    const revenueMap = {};
  
    paymentsSnap.docs.forEach((doc) => {
      const { examId, amount } = doc.data();
      if (!revenueMap[examId]) revenueMap[examId] = 0;
      revenueMap[examId] += amount || 0;
    });
  
    return revenueMap;
  };
  
  