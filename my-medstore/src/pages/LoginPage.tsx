// src/pages/LoginPage.tsx
import { motion } from "framer-motion";

export default function LoginPage() {

  const handlePhoneSignIn = () => {
    console.log("Signing in with Phone Number...");
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome</h1>
        <p className="text-gray-600 mb-8">Sign in to continue shopping</p>

        {/* Phone Number Sign In */}
        <button
          onClick={handlePhoneSignIn}
          className="w-full mt-4 flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-full font-semibold shadow transition"
        >
          Sign in with Phone Number
        </button>

      </motion.div>
    </div>
  );
}
