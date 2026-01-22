import { useEffect, useState } from "react";
import { fetchPaymentSettings, createPaymentRequest } from "../services/paymentService";
import useAuth from "../hooks/useAuth";

const PaymentModal = ({ exam, onClose }) => {
  const { user } = useAuth();
  const [settings, setSettings] = useState(null);
  const [txnId, setTxnId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await fetchPaymentSettings();
      setSettings(data);
      setLoading(false);
    };
    load();
  }, []);

  const handleSubmit = async () => {
    await createPaymentRequest({
      userId: user.uid,
      examId: exam.id,
      transactionId: txnId,
    });
    onClose();
    alert("Payment submitted. Await admin approval.");
  };

  if (loading) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-4 rounded w-full max-w-sm space-y-4">
        <h3 className="font-semibold">Pay ₹{exam.price}</h3>

        <div>
          <p>UPI ID: <strong>{settings.upiId}</strong></p>
          {settings.qrCodeUrl && (
            <img src={settings.qrCodeUrl} alt="QR Code" />
          )}
        </div>

        <input
          className="border p-2 w-full"
          placeholder="Transaction Reference ID"
          value={txnId}
          onChange={(e) => setTxnId(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
