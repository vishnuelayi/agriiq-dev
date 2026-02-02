import { useState, useRef } from "react";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { Leaf, BookOpen, BarChart3, Phone, ShieldCheck } from "lucide-react";

const UserOtpLogin = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔒 Stable reCAPTCHA instance (critical fix)
  const recaptchaRef = useRef(null);

  /* ---------------- SETUP RECAPTCHA (ONCE) ---------------- */
  const setupRecaptcha = () => {
    if (!recaptchaRef.current) {
      recaptchaRef.current = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
        }
      );
    }
    return recaptchaRef.current;
  };

  /* ---------------- SEND OTP ---------------- */
  const sendOtp = async () => {
    if (!phone) return;

    try {
      setLoading(true);

      const verifier = setupRecaptcha();

      const result = await signInWithPhoneNumber(auth, `+91${phone}`, verifier);

      setConfirmationResult(result);
    } catch (error) {
      console.error("OTP error:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- VERIFY OTP ---------------- */
  const verifyOtp = async () => {
    if (!otp || !confirmationResult) return;

    try {
      setLoading(true);

      const result = await confirmationResult.confirm(otp);

      const userRef = doc(db, "users", result.user.uid);
      const snap = await getDoc(userRef);

      if (!snap.exists()) {
        await setDoc(userRef, {
          uid: result.user.uid,
          phone: result.user.phoneNumber,
          role: "user",
          blocked: false,
          createdAt: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error("Verify OTP error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-white flex items-center justify-center px-4">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden grid md:grid-cols-2 border border-green-100">
        {/* LEFT — LANDING */}
        <div className="p-8 md:p-12 flex flex-col justify-center space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold text-primary">
            AgriIQ
          </h1>

          <p className="text-gray-600 text-base md:text-lg">
            A modern ed-tech platform built for agricultural students.
          </p>

          <ul className="space-y-3 text-sm text-gray-700">
            <li className="flex items-center gap-2">
              <Leaf size={18} className="text-primary" />
              Curated agriculture mock tests
            </li>
            <li className="flex items-center gap-2">
              <BookOpen size={18} className="text-primary" />
              Exam-oriented learning
            </li>
            <li className="flex items-center gap-2">
              <BarChart3 size={18} className="text-primary" />
              Instant results & analysis
            </li>
          </ul>

          <p className="text-xs text-gray-400">
            Learn smart. Practice better. Grow confidently.
          </p>
        </div>

        {/* RIGHT — OTP LOGIN */}
        <div className="p-8 md:p-12 flex flex-col justify-center space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900">
              Login / Sign up
            </h2>
            <p className="text-sm text-gray-500">
              Continue with your mobile number
            </p>
          </div>

          {/* PHONE INPUT (+91 FIXED) */}
          <div className="flex gap-2 w-full">
            <div className="w-16 flex items-center justify-center rounded-xl border bg-gray-50 text-sm">
              +91
            </div>

            <Input
              type="tel"
              placeholder="Mobile number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={!!confirmationResult}
              wrapperClassName="flex-1"
            />
          </div>

          {!confirmationResult && (
            <Button
              onClick={sendOtp}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <Phone size={16} />
              {loading ? "Sending OTP…" : "Send OTP"}
            </Button>
          )}

          {/* OTP INPUT — SMOOTH DROPDOWN */}
          {confirmationResult && (
            <div className="space-y-4 animate-slide-down">
              <Input
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />

              <Button
                onClick={verifyOtp}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2"
              >
                <ShieldCheck size={16} />
                {loading ? "Verifying…" : "Verify & Continue"}
              </Button>
            </div>
          )}

          <p className="text-xs text-gray-400 text-center">
            By continuing, you agree to our terms & privacy policy.
          </p>
        </div>
      </div>

      {/* 🔑 MUST ALWAYS EXIST — DO NOT CONDITIONALLY RENDER */}
      <div id="recaptcha-container" />
    </div>
  );
};

export default UserOtpLogin;
