import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function CheckoutPage() {
  const { items, clear } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (items.length === 0) {
      navigate("/");
    }
  }, [items, navigate]);

  const handlePlaceOrder = () => {
    alert("Order placed! (mock)");
    clear();
    navigate("/");
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>
      <div className="p-6 rounded-md bg-white/20">
        <p className="mb-4">This is a demo checkout. Integrate a real payments provider to accept payments.</p>
        <button onClick={handlePlaceOrder} className="px-5 py-2 rounded-full bg-indigo-600 text-white font-semibold">
          Place Order
        </button>
      </div>
    </div>
  );
}
