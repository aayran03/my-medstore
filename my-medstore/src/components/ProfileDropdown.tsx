// src/components/ProfileDropdown.tsx (or wherever your dropdown is)
import { getAuth } from "firebase/auth";
import app from "../firebaseConfig";  // Import your initialized app here
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
const auth = getAuth(app);  // Pass the initialized app explicitly

export default function ProfileDropdown() {
  const { logout, currentUser } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  if (!currentUser) {
    return (
      <Link
        to="/"
        className="px-4 py-2 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
      >
        Login / Sign In
      </Link>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 focus:outline-none"
        aria-haspopup="true"
        aria-expanded={open}
      >
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-cyan-500 flex items-center justify-center text-white font-bold shadow cursor-pointer select-none">
          P
        </div>
        <span className="text-lg font-semibold hidden md:inline">Profile</span>
        <svg
          className={`w-5 h-5 ml-1 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
          <Link
            to="/profile"
            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-indigo-600 hover:text-white transition"
            onClick={() => setOpen(false)}
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-cyan-500 flex items-center justify-center text-white font-bold shadow">
              P
            </div>
            <div className="text-lg font-semibold">Profile</div>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-100 transition"
          >
            Log Out
          </button>
        </div>
      )}
    </div>
  );
}