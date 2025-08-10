import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { type Product } from "../data/products";

function formatPrice(n: number) {
  return `₹${n.toFixed(0)}`;
}

export default function ProductCard({ p }: { p: Product }) {
  const cart = useCart();
  const navigate = useNavigate();

  // Get current quantity of this product in cart
  const cartItem = cart.items.find((item) => item.productId === p.id);
  const qty = cartItem ? cartItem.qty : 0;
  
  return (
    <motion.article
      layout
      whileHover={{ scale: 1.03 }}
      className="relative rounded-2xl overflow-hidden shadow-lg transition-transform cursor-pointer"
      style={{ background: `linear-gradient(135deg, ${p.colorA} 0%, ${p.colorB} 100%)` }}
    >
      <div className="p-4 backdrop-blur-sm bg-white/20 min-h-[160px] flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-slate-900 text-lg">{p.title}</h3>
          <p className="text-slate-800 text-sm mt-1">{p.description}</p>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-extrabold text-slate-900">{formatPrice(p.price)}</span>
            <span className="text-xs text-slate-700">/unit</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(`/product/${p.id}`)}
              className="px-3 py-1 rounded-full bg-white/30 backdrop-blur text-sm font-medium hover:bg-white/50 transition"
            >
              View
            </button>

            {qty === 0 ? (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => cart.add(p.id)}
                className="px-3 py-1 rounded-full bg-white text-sm font-semibold shadow hover:opacity-95"
              >
                Add
              </motion.button>
            ) : (
              <div className="flex items-center gap-2 bg-white rounded-full shadow px-3 py-1 select-none">
                <button
                  onClick={() => cart.remove(p.id)}
                  className="text-lg font-bold px-2 hover:text-rose-600"
                  aria-label="Decrease quantity"
                >
                  –
                </button>
                <span className="font-semibold">{qty}</span>
                <button
                  onClick={() => cart.add(p.id)}
                  className="text-lg font-bold px-2 hover:text-green-600"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="absolute inset-0 opacity-0 hover:opacity-70 transition-opacity pointer-events-none">
        <div
          className="w-full h-full"
          style={{ background: "linear-gradient(45deg, rgba(255,255,255,0.12), rgba(255,255,255,0.02))" }}
        />
      </div>
    </motion.article>
  );
}
