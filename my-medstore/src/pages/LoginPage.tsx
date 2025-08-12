// src/pages/LoginPage.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { getAuth, signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";
import type { ConfirmationResult, RecaptchaVerifier as RecaptchaVerifierType } from "firebase/auth";
import "../firebaseConfig"; // make sure Firebase is initialized
import { useNavigate } from "react-router-dom";


const auth = getAuth();
auth.languageCode = 'it';

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifierType;
  }
}

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  const handleSendOtp = async () => {
    const auth = getAuth();

    // Create Recaptcha
    window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
    });

    try {
      const result = await signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier);
      setConfirmationResult(result);
      alert("OTP sent!");
    } catch (err) {
      console.error("Error sending OTP", err);
    }
  };

const navigate = useNavigate();

const handleVerifyOtp = async () => {
  try {
    if (confirmationResult) {
      const result = await confirmationResult.confirm(otp);
      console.log("User signed in:", result.user);
      navigate("/Home"); // Go to homepage
    }
  } catch (err) {
    console.error("OTP verification failed:", err);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Phone Login</h1>

        <input
          type="tel"
          placeholder="+91 999999999"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="w-full mb-4 px-4 py-2 border rounded"
        />

        {!confirmationResult && (
          <button
            onClick={handleSendOtp}
            className="w-full bg-green-500 text-white py-2 rounded"
          >
            Send OTP
          </button>
        )}

        {confirmationResult && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full mb-4 px-4 py-2 border rounded"
            />
            <button
              onClick={handleVerifyOtp}
              className="w-full bg-blue-500 text-white py-2 rounded"
            >
              Verify OTP
            </button>
          </>
        )}

        <div id="recaptcha-container"></div>
      </motion.div>
    </div>
  );
}
