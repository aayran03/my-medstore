// src/pages/LoginPage.tsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  getAuth,
  signInWithPhoneNumber,
  RecaptchaVerifier,
} from "firebase/auth";
import type {
  ConfirmationResult,
  RecaptchaVerifier as RecaptchaVerifierType,
} from "firebase/auth";
import "../firebaseConfig"; // Firebase init
import { useNavigate } from "react-router-dom";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

const auth = getAuth();
const db = getFirestore();

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifierType;
  }
}

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Setup invisible reCAPTCHA once on component mount
  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: () => {
            // reCAPTCHA solved, allow sendOtp to proceed
          },
        }
      );
      // You can also render the reCAPTCHA widget if you want visible version:
      // window.recaptchaVerifier.render();
    }
  }, []);

  const handleSendOtp = async () => {
    if (!phoneNumber.startsWith("+")) {
      alert("Please include country code (e.g., +91XXXXXXXXXX)");
      return;
    }

    setLoading(true);
    try {
      const appVerifier = window.recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setConfirmationResult(result);
      alert("OTP sent!");
    } catch (err) {
      console.error("Error sending OTP", err);
      alert("Failed to send OTP. Please try again.");
      // Reset reCAPTCHA in case of error so user can retry
      window.recaptchaVerifier.clear();
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        { size: "invisible" }
      );
    }
    setLoading(false);
  };

  const handleVerifyOtp = async () => {
    if (!confirmationResult) return;

    if (otp.length < 6) {
      alert("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const result = await confirmationResult.confirm(otp);
      const user = result.user;

      // Check if user exists in Firestore
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        // Existing user → Go to Home
        navigate("/Home");
      } else {
        // New user → Create basic profile & go to registration form
        await setDoc(userRef, {
          phone: phoneNumber,
          createdAt: new Date(),
        });
        navigate("/register");
      }
    } catch (err) {
      console.error("OTP verification failed:", err);
      alert("Invalid OTP. Please try again.");
    }
    setLoading(false);
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
          placeholder="+91 9999999999"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="w-full mb-4 px-4 py-2 border rounded"
          disabled={!!confirmationResult || loading}
          autoFocus
        />

        {!confirmationResult && (
          <button
            onClick={handleSendOtp}
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 disabled:opacity-50"
            disabled={loading || phoneNumber.length < 10}
          >
            {loading ? "Sending..." : "Send OTP"}
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
              maxLength={6}
              disabled={loading}
              autoFocus
            />
            <button
              onClick={handleVerifyOtp}
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
              disabled={loading || otp.length < 6}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}

        <div id="recaptcha-container"></div>
      </motion.div>
    </div>
  );
}
