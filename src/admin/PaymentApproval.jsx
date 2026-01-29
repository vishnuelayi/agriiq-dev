import { useEffect, useState } from "react";
import { collection, getDocs, query, where, updateDoc, doc } from "firebase/firestore";
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

  const updateStatus = async (paymentId, status) => {
    await updateDoc(doc(db, "payments", paymentId), { status });
    setPayments((prev) => prev.filter((p) => p.id !== paymentId));
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
              onClick={() => updateStatus(p.id, "approved")}
            >
              Approve
            </button>
            <button
              className="bg-red-600 text-white px-3 py-1 rounded"
              onClick={() => updateStatus(p.id, "rejected")}
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
