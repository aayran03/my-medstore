import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import type { Product } from "../data/products";

function formatPrice(n: number) {
  return `₹${n.toFixed(0)}`;
}

export default function CartPage() {
  const { items, add, remove, clear } = useCart();
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:4000/api/products")
      .then((res) => res.json())
      .then((data: Product[]) => {
        setProducts(data);
      })
      .catch(() => {
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-6">Loading cart...</div>;
  }

  const detailed = items.map((it) => ({
    ...it,
    product: products.find((p) => p.id === it.productId),
  }));

  const total = detailed.reduce((sum, d) => sum + (d.product ? d.product.price * d.qty : 0), 0);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>

      {items.length === 0 ? (
        <div className="p-6 bg-white/60 rounded-md">
          Cart is empty —{" "}
          <button className="text-indigo-600 underline" onClick={() => navigate("/")}>
            Continue shopping
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {detailed.map((d) => {
            if (!d.product) return null;
            return (
              <div key={d.productId} className="p-4 rounded-xl bg-white/20 flex items-center justify-between">
                <div>
                  <div className="font-semibold">{d.product.title}</div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      if (d.qty === 1) remove(d.productId);
                      else remove(d.productId); // See note below
                    }}
                    className="px-3 py-1 rounded-full bg-rose-500 text-white"
                    aria-label="Decrease quantity"
                  >
                    –
                  </button>

                  <span className="font-semibold">{d.qty}</span>

                  <button
                    onClick={() => add(d.productId, 1)}
                    className="px-3 py-1 rounded-full bg-green-500 text-white"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>

                  <div className="font-bold">{formatPrice(d.product.price * d.qty)}</div>
                </div>
              </div>
            );
          })}

          <div className="flex items-center justify-between p-4 bg-white/30 rounded-md">
            <div className="font-semibold">Total</div>
            <div className="text-xl font-extrabold">{formatPrice(total)}</div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => navigate("/checkout")} className="px-4 py-2 rounded-full bg-green-600 text-white font-semibold">
              Checkout
            </button>
            <button onClick={() => clear()} className="px-4 py-2 rounded-full border">
              Clear cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
