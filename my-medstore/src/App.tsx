import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import { CartProvider } from "./context/CartContext";
import Home from "./pages/Home";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import ProfileSetupPage from "./pages/ProfileSetupPage";
import RequireAuth from "./components/RequireAuth";
import { AuthProvider } from "./context/AuthContext";
import FirstPage from "./pages/FirstPage"
export default function App() {
  return (
  <AuthProvider>
    <BrowserRouter>
      <CartProvider>
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
          <Navbar />
          <main className="pt-6">
            <Routes>
              <Route path="/" element={<FirstPage />} />
              <Route path="/Login" element={<LoginPage />} />
              <Route path="/Home" element={<RequireAuth><Home /></RequireAuth>} />
              <Route path="/register" element={<ProfileSetupPage/>} />
              <Route path="/product/:id" element={<RequireAuth><ProductPage /></RequireAuth>} />
              <Route path="/cart" element={<RequireAuth><CartPage /></RequireAuth>} />
              <Route path="/checkout" element={<RequireAuth><CheckoutPage /></RequireAuth>} />
              <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
            </Routes>
          </main>
          <footer className="mt-12 py-6 text-center text-sm text-slate-500">
            &copy; {new Date().getFullYear()} MedStore — demo frontend
          </footer>
        </div>
      </CartProvider>
    </BrowserRouter>
  </AuthProvider>
  );
}
