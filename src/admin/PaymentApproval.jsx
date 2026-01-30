import { useEffect, useState } from "react";
import { collection, getDocs, query, where, updateDoc, doc, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebase";

const PaymentApproval = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const loadPayments = async () => {
      const q = query(
        collection(db, "payments"),
        where("status", "==", "pending")
      );
      const snapshot = await getDocs(q);
      setPayments(
        snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
      );
    };
    loadPayments();
  }, []);

  const updateStatus = async (payment, status) => {
    const paymentRef = doc(db, "payments", payment.id);

    await updateDoc(paymentRef, { status });

    if (status === "approved") {
      await addDoc(collection(db, "userExams"), {
        userId: payment.userId,
        examId: payment.examId,
        status: "unlocked",
        unlockedAt: serverTimestamp(),
      });
    }

    setPayments((prev) => prev.filter((p) => p.id !== payment.id));
  };


  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">Pending Payments</h2>

      {payments.length === 0 && (
        <div className="text-gray-500">No pending payments</div>
      )}

      {payments.map((p) => (
        <div key={p.id} className="border p-3 rounded space-y-2">
          <div>User: {p.userId}</div>
          <div>Exam: {p.examId}</div>
          <div>Txn ID: {p.transactionId}</div>

          <div className="flex gap-2">
            <button
              className="bg-green-600 text-white px-3 py-1 rounded"
              onClick={() => updateStatus(p, "approved")}
            >
              Approve
            </button>
            <button
              className="bg-red-600 text-white px-3 py-1 rounded"
              onClick={() => updateStatus(p, "rejected")}
            >
              Reject
            </button>


          </div>
        </div>
      ))}
    </div>
  );
};

export default PaymentApproval;
