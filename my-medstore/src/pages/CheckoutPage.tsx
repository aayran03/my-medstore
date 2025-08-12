import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { fetchProducts} from "../data/products"; // adjust path
import type { Product } from "../data/products";

export default function CheckoutPage() {
  const { items, clear } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (items.length === 0) {
      navigate("/Home");
    } else {
      fetchProducts().then(setProducts);
    }
  }, [items, navigate]);

  const cartWithDetails = items.map(item => {
    const product = products.find(p => p.id === item.productId);
    return {
      ...item,
      title: product?.title || "Unknown",
      price: product?.price || 0
    };
  });

  const total = cartWithDetails.reduce((sum, p) => sum + p.price * p.qty, 0);

  const handlePlaceOrder = () => {
    alert("Order placed!");
    clear();
    navigate("/");
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>

      {/* Order Slip */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h3 className="text-lg font-semibold mb-3">Order Summary</h3>
        {cartWithDetails.map((item, idx) => (
          <div key={idx} className="flex justify-between border-b py-2">
            <span>{item.title} × {item.qty}</span>
            <span>₹{item.price * item.qty}</span>
          </div>
        ))}
        <div className="flex justify-between font-bold pt-3">
          <span>Total</span>
          <span>₹{total}</span>
        </div>
      </div>

      {/* Payment Options */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h3 className="text-lg font-semibold mb-3">Payment Method</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input type="radio" name="payment" defaultChecked /> Cash on Delivery
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="payment" /> Credit/Debit Card
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="payment" /> UPI / Net Banking
          </label>
        </div>
      </div>

      <button
        onClick={handlePlaceOrder}
        className="w-full px-5 py-2 rounded-full bg-indigo-600 text-white font-semibold"
      >
        Place Order
      </button>
    </div>
  );
}