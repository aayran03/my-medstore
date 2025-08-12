import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { fetchProducts} from "../data/products";
import type { Product } from "../data/products";
function formatPrice(n: number) {
  return `₹${n.toFixed(0)}`;
}

export default function CheckoutPage() {
  const { items, clear } = useCart();
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [tip, setTip] = useState<number>(0);
  const [customTip, setCustomTip] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "card" | "upi">("cod");

  useEffect(() => {
    if (items.length === 0) {
      navigate("/Home");
      return;
    }

    setLoading(true);
    fetchProducts()
      .then(setProducts)
      .finally(() => setLoading(false));
  }, [items, navigate]);

  if (loading) {
    return <div className="p-6">Loading checkout...</div>;
  }

  const detailedItems = items.map((item) => ({
    ...item,
    product: products.find((p) => p.id === item.productId),
  }));

  const subtotal = detailedItems.reduce(
    (sum, d) => sum + (d.product ? d.product.price * d.qty : 0),
    0
  );

  const deliveryCharge = subtotal < 500 && subtotal > 0 ? 20 : 0;
  const total = subtotal + deliveryCharge + tip;

  const handlePlaceOrder = () => {
    alert(
      `Order placed!\nPayment Method: ${paymentMethod.toUpperCase()}\nTotal: ${formatPrice(total)}`
    );
    clear();
    navigate("/");
  };

  const handleCustomTipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/^\d*$/.test(val)) {
      setCustomTip(val);
      setTip(Number(val) || 0);
    }
  };

  const presetTips = [10, 50, 100];

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Checkout</h2>

      <div className="mb-6">
        <h3 className="font-semibold mb-2">Order Summary</h3>
        <div className="space-y-3 max-h-60 overflow-auto">
          {detailedItems.map((d) =>
            d.product ? (
              <div key={d.productId} className="flex justify-between">
                <div>
                  {d.product.title} × {d.qty}
                </div>
                <div>{formatPrice(d.product.price * d.qty)}</div>
              </div>
            ) : null
          )}
        </div>

        <div className="flex justify-between mt-4 border-t pt-3 font-semibold">
          <div>Subtotal</div>
          <div>{formatPrice(subtotal)}</div>
        </div>
        <div className="flex justify-between mt-1 font-semibold">
          <div>Delivery Charges</div>
          <div>{deliveryCharge > 0 ? formatPrice(deliveryCharge) : "Free"}</div>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold mb-2">Add a Tip</h3>
          <div className="flex gap-3 mb-3">
            {presetTips.map((amount) => (
              <button
                key={amount}
                onClick={() => {
                  setTip(amount);
                  setCustomTip("");
                }}
                className={`px-4 py-2 rounded-full border ${
                  tip === amount
                    ? "bg-green-500 text-white border-green-500"
                    : "border-gray-300"
                }`}
              >
                {formatPrice(amount)}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Custom tip"
            value={customTip}
            onChange={handleCustomTipChange}
            className="border rounded-md px-3 py-2 w-full max-w-xs"
          />
        </div>

        <div className="mt-6">
          <h3 className="font-semibold mb-2">Payment Method</h3>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
              />
              Cash on Delivery (COD)
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={paymentMethod === "card"}
                onChange={() => setPaymentMethod("card")}
              />
              Card Payment
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="paymentMethod"
                value="upi"
                checked={paymentMethod === "upi"}
                onChange={() => setPaymentMethod("upi")}
              />
              UPI Payment
            </label>
          </div>
        </div>

        <div className="flex justify-between mt-6 text-xl font-extrabold border-t pt-4">
          <div>Total</div>
          <div>{formatPrice(total)}</div>
        </div>

        <button
          onClick={handlePlaceOrder}
          className="mt-6 w-full py-3 bg-indigo-600 text-white font-semibold rounded-full shadow hover:bg-indigo-700 transition"
        >
          Place Order
        </button>
      </div>
    </div>
  );
}
