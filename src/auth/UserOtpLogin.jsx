import { useState } from "react";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

const UserOtpLogin = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        { size: "invisible" }
      );
    }
  };

  const sendOtp = async () => {
    try {
      setupRecaptcha();

      const result = await signInWithPhoneNumber(
        auth,
        phone,
        window.recaptchaVerifier
      );

      setConfirmationResult(result);
    } catch (error) {
      console.error("OTP error:", error);
    }
  };

  const verifyOtp = async () => {
    try {
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
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm space-y-4">
        <input
          className="border p-2 w-full"
          placeholder="+91XXXXXXXXXX"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <button
          className="w-full bg-green-600 text-white p-2"
          onClick={sendOtp}
        >
          Send OTP
        </button>

        {confirmationResult && (
          <>
            <input
              className="border p-2 w-full"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button
              className="w-full bg-black text-white p-2"
              onClick={verifyOtp}
            >
              Verify OTP
            </button>
          </>
        )}

        <div id="recaptcha-container"></div>
      </div>
    </div>
  );
};

export default UserOtpLogin;
