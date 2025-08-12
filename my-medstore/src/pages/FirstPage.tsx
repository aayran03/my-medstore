import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400">
      {/* Background animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"
      />

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-white"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <motion.h1
          className="text-5xl font-bold mb-12 drop-shadow-lg"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          Welcome to Our Website
        </motion.h1>

        <div className="flex gap-6">
          {/* Sign In Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/login")}
            className="px-8 py-4 bg-white text-purple-700 rounded-2xl font-semibold shadow-lg hover:shadow-purple-500/50 transition-shadow"
          >
            Sign In
          </motion.button>

          {/* Sign Up Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/register")}
            className="px-8 py-4 bg-purple-700 text-white rounded-2xl font-semibold shadow-lg hover:shadow-purple-500/50 transition-shadow"
          >
            Sign Up
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
