import {
    addDoc,
    collection,
    doc,
    getDoc,
    serverTimestamp,
  } from "firebase/firestore";
  import { db } from "../firebase/firebase";
  
  export const fetchPaymentSettings = async () => {
    const ref = doc(db, "settings", "payment");
    const snap = await getDoc(ref);
    return snap.exists() ? snap.data() : null;
  };
  
  export const createPaymentRequest = async ({
    userId,
    examId,
    transactionId,
    amount
  }) => {
    await addDoc(collection(db, "payments"), {
      userId,
      examId,
      amount,
      transactionId,
      status: "pending",
      createdAt: serverTimestamp(),
    });
  };
  