import { Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import FooterSection from "./components/layout/FooterSection";
import LandingPage from "./pages/LandingPage/LandingPage";
import SignUp from "./pages/auth/signup";
import SignIn from "./pages/auth/signIn";
import ProtectedRoute from "./components/routes/protectedRoute";
import Profile from "./pages/profile/profile";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { api } from "./api/api";
import { setUser } from "./store/authSlice";
import ShopPage from "./pages/Shop/ShopPage";
import ProductPage from "./pages/Product/ProductPage";
import CartPage from "./pages/Cart/CartPage";
import ShippingPage from "./pages/Checkout/ShippingPage";
import PaymentPage from "./pages/Checkout/PaymentPage";


function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await api.get("/user/user-profile");

        dispatch(setUser(res.data.user));

      } catch (err) {
        console.log("Not logged in");
      }
    };

    loadUser();
  }, [dispatch]);

  return (
    <>
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <Navbar />
        <main className="mx-auto w-full max-w-6xl px-4 py-6">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout/shipping" element={<ShippingPage />} />
            <Route path="/checkout/payment" element={<PaymentPage />} />
            <Route path="/user-profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
        <FooterSection />
      </div>
    </>
  )
}

export default App


