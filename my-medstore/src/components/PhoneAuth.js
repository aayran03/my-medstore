import React, { useState } from "react";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { app } from "../firebaseConfig";

const auth = getAuth(app);

export default function PhoneAuth() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);

  const sendOTP = async () => {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
      callback: (response) => {
        console.log("Recaptcha verified");
      }
    });

    const result = await signInWithPhoneNumber(auth, phone, window.recaptchaVerifier);
    setConfirmationResult(result);
    alert("OTP sent!");
  };

  const verifyOTP = async () => {
    try {
      await confirmationResult.confirm(otp);
      alert("Phone authentication successful!");
    } catch (error) {
      alert("Invalid OTP");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div id="recaptcha-container"></div>

      {!confirmationResult ? (
        <>
          <input
            type="tel"
            placeholder="+91 9876543210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border p-2 mb-4"
          />
          <button onClick={sendOTP} className="bg-blue-500 text-white px-4 py-2 rounded">
            Send OTP
          </button>
        </>
      ) : (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="border p-2 mb-4"
          />
          <button onClick={verifyOTP} className="bg-green-500 text-white px-4 py-2 rounded">
            Verify OTP
          </button>
        </>
      )}
    </div>
  );
}
