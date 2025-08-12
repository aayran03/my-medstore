import { useState } from "react";
import { motion } from "framer-motion";
import { auth, db, setUpRecaptcha } from "../firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { signInWithPhoneNumber } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import type { ConfirmationResult } from "firebase/auth";
export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null);
  const navigate = useNavigate();

  const sendOtp = async () => {
    if (!phone) {
      alert("Enter phone number");
      return;
    }

    // Check if user already exists in Firestore
    const q = query(collection(db, "users"), where("phone", "==", phone));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      navigate("/login", { state: { message: "User already available" } });
      return;
    }

    try {
      const appVerifier = setUpRecaptcha("recaptcha-container");
      const confirmationResult = await signInWithPhoneNumber(auth, phone, appVerifier);
      setConfirmation(confirmationResult);
      alert("OTP sent to your phone");
    } catch (err) {
      console.error(err);
      alert("Error sending OTP");
    }
  };

  const verifyOtp = async () => {
    if (!confirmation || !otp) {
      alert("Enter OTP");
      return;
    }

    try {
      await confirmation.confirm(otp);
      alert("Phone number verified. Proceed with registration.");
      // Save user details in Firestore here if needed
    } catch (err) {
      console.error(err);
      alert("Invalid OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400">
      <motion.div
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="w-full p-3 mb-4 border rounded-lg"
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="w-full p-3 mb-4 border rounded-lg"
        />
        <input
          type="tel"
          placeholder="+91 9876543210"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full p-3 mb-4 border rounded-lg"
        />

        {!confirmation && (
          <button
            onClick={sendOtp}
            className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            Send OTP
          </button>
        )}

        {confirmation && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-3 mt-4 mb-4 border rounded-lg"
            />
            <button
              onClick={verifyOtp}
              className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
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
