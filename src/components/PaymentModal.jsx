import { useEffect, useState } from "react";
import {
  fetchPaymentSettings,
  createPaymentRequest,
} from "../services/paymentService";
import useAuth from "../hooks/useAuth";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { toast } from "sonner";

const PaymentModal = ({ exam, onClose }) => {
  const { user } = useAuth();
  const [settings, setSettings] = useState(null);
  const [txnId, setTxnId] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      const data = await fetchPaymentSettings();
      setSettings(data);
      setLoading(false);
    };
    load();
  }, []);

  const handleSubmit = async () => {
    if (!txnId.trim()) {
      toast.error("Please enter transaction reference ID");
      return;
    }

    setSubmitting(true);

    await createPaymentRequest({
      userId: user.uid,
      examId: exam.id,
      amount: exam.price,
      transactionId: txnId,
    });

    setSubmitting(false);
    onClose();
    toast.success("Payment submitted for approval");
  };

  if (loading) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <Card
        className="w-full max-w-sm animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-4">
          {/* HEADER */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Pay ₹{exam.price}
            </h3>
            <p className="text-sm text-muted">
              Complete payment to unlock this exam
            </p>
          </div>

          {/* PAYMENT DETAILS */}
          <div className="space-y-2">
            <p className="text-sm">
              UPI ID: <strong className="select-all">{settings.upiId}</strong>
            </p>

            {settings.qrCodeUrl && (
              <img
                src={settings.qrCodeUrl}
                alt="UPI QR Code"
                className="w-40 mx-auto rounded"
              />
            )}
          </div>

          {/* INPUT */}
          <Input
            
            placeholder="Enter UPI transaction ID"
            value={txnId}
            onChange={(e) => setTxnId(e.target.value)}
          />

          {/* ACTIONS */}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={onClose} disabled={submitting}>
              Cancel
            </Button>

            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PaymentModal;
