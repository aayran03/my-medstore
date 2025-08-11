import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import { CartProvider } from "./context/CartContext";
import Home from "./pages/Home";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
          <Navbar />
          <main className="pt-6">
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/Home" element={<Home />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </main>
          <footer className="mt-12 py-6 text-center text-sm text-slate-500">
            &copy; {new Date().getFullYear()} MedStore — demo frontend
          </footer>
        </div>
      </CartProvider>
    </BrowserRouter>
  );
}
