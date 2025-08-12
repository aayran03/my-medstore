import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { fetchProducts} from "../data/products"; // adjust path
import type { Product } from "../data/products";


export default function CheckoutPage() {
  const { items, clear } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [tip, setTip] = useState(0);
  const [customTip, setCustomTip] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (items.length === 0) {
      navigate("/Home");
    } else {
      fetchProducts().then(setProducts);
    }
  }, [items, navigate]);

  // Combine cart items with product details
  const cartWithDetails = items.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    return {
      ...item,
      title: product?.title || "Unknown",
      price: product?.price || 0,
    };
  });

  const subtotal = cartWithDetails.reduce(
    (sum, p) => sum + p.price * p.qty,
    0
  );
  const total = subtotal + tip;

  const handlePlaceOrder = () => {
    alert(`Order placed! Total: ₹${total} (including tip ₹${tip})`);
    clear();
    navigate("/");
  };

  const handleAddCustomTip = () => {
    const val = parseInt(customTip);
    if (!isNaN(val) && val >= 0) {
      setTip(val);
      setCustomTip("");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>

      {/* Order Slip */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h3 className="text-lg font-semibold mb-3">Order Summary</h3>
        {cartWithDetails.map((item, idx) => (
          <div key={idx} className="flex justify-between border-b py-2">
            <span>
              {item.title} × {item.qty}
            </span>
            <span>₹{item.price * item.qty}</span>
          </div>
        ))}
        <div className="flex justify-between font-semibold pt-3 border-t">
          <span>Subtotal</span>
          <span>₹{subtotal}</span>
        </div>
        <div className="flex justify-between font-semibold pt-3">
          <span>Tip</span>
          <span>₹{tip}</span>
        </div>
        <div className="flex justify-between font-bold pt-3 border-t">
          <span>Total</span>
          <span>₹{total}</span>
        </div>
      </div>

      {/* Tip Selection */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h3 className="text-lg font-semibold mb-3">Add a Tip (Optional)</h3>
        <div className="flex gap-3 mb-3">
          {[10, 50, 100].map((amount) => (
            <button
              key={amount}
              onClick={() => setTip(amount)}
              className={`px-4 py-2 rounded-full font-semibold border ${
                tip === amount
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "border-gray-300 hover:bg-gray-100"
              }`}
            >
              ₹{amount}
            </button>
          ))}
        </div>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            min={0}
            value={customTip}
            onChange={(e) => setCustomTip(e.target.value)}
            placeholder="Custom tip"
            className="flex-grow px-3 py-2 border rounded"
          />
          <button
            onClick={handleAddCustomTip}
            className="px-4 py-2 rounded-full bg-green-600 text-white font-semibold"
          >
            Add
          </button>
        </div>
      </div>

      {/* Payment Options */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h3 className="text-lg font-semibold mb-3">Payment Method</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input type="radio" name="payment" defaultChecked />
            Cash on Delivery
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="payment" />
            Credit/Debit Card
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="payment" />
            UPI / Net Banking
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
