import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { items } = useCart();
  const totalCount = items.reduce((s, it) => s + it.qty, 0);

  return (
    <nav className="w-full bg-white/60 backdrop-blur-md sticky top-0 z-30 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/Home" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-indigo-500 flex items-center justify-center text-white font-bold shadow">
            M
          </div>
          <div className="text-lg font-semibold">MedStore</div>
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/Home" className="text-sm text-slate-700 hover:text-slate-900">
            Shop
          </Link>
          <Link
            to="/cart"
            className="relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4" />
            </svg>
            <span className="text-sm">Cart</span>
            {totalCount > 0 && (
              <span className="ml-1 text-xs font-semibold px-2 py-0.5 bg-rose-500 text-white rounded-full">
                {totalCount}
              </span>
            )}
          </Link>
          <Link to="/profile" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-cyan-500 flex items-center justify-center text-white font-bold shadow">
            P
          </div>
          <div className="text-lg font-semibold">Profile</div>
        </Link>
        </div>
      </div>
    </nav>
  );
}
