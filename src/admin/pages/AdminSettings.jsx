import { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout";
import Card from "../../ui/Card";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import SkeletonCard from "../../ui/SkeletonCard";
import { toast } from "sonner";

import {
  fetchPaymentSettings,
  savePaymentSettings,
  fetchAnnouncement,
  saveAnnouncement,
} from "../../services/settingsService";

const AdminSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [payment, setPayment] = useState({
    upiId: "",
    qrCodeUrl: "",
  });

  const [announcement, setAnnouncement] = useState({
    message: "",
    active: true,
  });

  useEffect(() => {
    const load = async () => {
      try {
        const p = await fetchPaymentSettings();
        const a = await fetchAnnouncement();

        if (p) setPayment(p);
        if (a) setAnnouncement(a);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const saveAll = async () => {
    try {
      setSaving(true);
      await savePaymentSettings(payment);
      await saveAnnouncement(announcement);
      toast.success("Settings saved");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout title="Settings">
      {loading && (
        <div className="space-y-4">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {!loading && (
        <div className="space-y-6">
          {/* ================= PAYMENT SETTINGS ================= */}
          <Card className="space-y-4">
            <h2 className="text-sm font-semibold text-gray-700">
              Payment Settings
            </h2>

            <Input
              label="UPI ID"
              placeholder="example@upi"
              value={payment.upiId}
              onChange={(e) =>
                setPayment((p) => ({
                  ...p,
                  upiId: e.target.value,
                }))
              }
            />

            <Input
              label="QR Code Image URL"
              placeholder="https://..."
              value={payment.qrCodeUrl}
              onChange={(e) =>
                setPayment((p) => ({
                  ...p,
                  qrCodeUrl: e.target.value,
                }))
              }
            />

            {payment.qrCodeUrl && (
              <img
                src={payment.qrCodeUrl}
                alt="QR Preview"
                className="w-32 rounded border"
              />
            )}
          </Card>

          {/* ================= ANNOUNCEMENT ================= */}
          <Card className="space-y-4">
            <h2 className="text-sm font-semibold text-gray-700">
              User Announcement
            </h2>

            <Input
              label="Message"
              placeholder="Announcement text"
              value={announcement.message}
              onChange={(e) =>
                setAnnouncement((a) => ({
                  ...a,
                  message: e.target.value,
                }))
              }
            />

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={announcement.active}
                onChange={(e) =>
                  setAnnouncement((a) => ({
                    ...a,
                    active: e.target.checked,
                  }))
                }
              />
              Active (visible to users)
            </label>
          </Card>

          {/* ================= SAVE ================= */}
          <div className="pt-2">
            <Button onClick={saveAll} disabled={saving}>
              {saving ? "Saving…" : "Save Settings"}
            </Button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminSettings;
