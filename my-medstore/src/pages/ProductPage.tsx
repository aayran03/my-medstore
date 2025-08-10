import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import type { Product } from "../data/products";

function formatPrice(n: number) {
  return `₹${n.toFixed(0)}`;
}

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const cart = useCart();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get current quantity of this product in cart
  const cartItem = cart.items.find((item) => item.productId === id);
  const qty = cartItem ? cartItem.qty : 0;

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    fetch(`http://localhost:4000/api/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then((data: Product) => {
        setProduct(data);
        setError("");
      })
      .catch((e) => {
        setError(e.message);
        setProduct(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="p-6">Loading product...</div>;
  }

  if (error) {
    return (
      <div className="p-6">
        <div>{error}</div>
        <div className="mt-4">
          <Link to="/" className="text-indigo-600 underline">
            Back to shop
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-6">
        <div>Product not found</div>
        <div className="mt-4">
          <Link to="/" className="text-indigo-600 underline">
            Back to shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-2xl p-6"
          style={{ background: `linear-gradient(135deg, ${product.colorA}, ${product.colorB})` }}
        >
          <div className="h-56 rounded-xl bg-white/30 backdrop-blur flex items-center justify-center">
            <div className="text-white font-bold text-2xl">{product.title}</div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-4">
          <h2 className="text-2xl font-bold">{product.title}</h2>
          <p className="text-slate-700 mt-2">{product.description}</p>

          <div className="mt-4 flex items-center gap-4">
            <div className="text-3xl font-extrabold">{formatPrice(product.price)}</div>
            <div className="text-sm text-slate-600">Free delivery above ₹500</div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            {qty === 0 ? (
              <button
                onClick={() => cart.add(product.id)}
                className="px-5 py-2 rounded-full bg-indigo-600 text-white font-semibold shadow"
              >
                Add to Cart
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-indigo-600 rounded-full shadow px-3 py-1 select-none text-white">
                <button
                  onClick={() => {
                    if (qty === 1) cart.remove(product.id);
                    else cart.remove ? cart.remove(product.id) : cart.clear();
                  }}
                  className="text-lg font-bold px-2 hover:text-rose-300"
                  aria-label="Decrease quantity"
                >
                  –
                </button>
                <span className="font-semibold">{qty}</span>
                <button
                  onClick={() => cart.add(product.id)}
                  className="text-lg font-bold px-2 hover:text-green-300"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            )}

            <button
              onClick={() => navigate("/cart")}
              className="px-4 py-2 rounded-full border border-indigo-200 text-indigo-700"
            >
              Go to Cart
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
