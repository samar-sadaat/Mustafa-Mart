import { Route, Routes, Navigate } from "react-router-dom";
import AdminSignin from "./pages/AdminSignin";
import AdminLayout from "./pages/AdminLayout";
import AdminProductsPage from "./pages/AdminProductsPage";
import AdminOrdersPage from "./pages/AdminOrdersPage";
import AdminProtected from "./components/AdminProtected";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<AdminSignin />} />

      <Route element={<AdminProtected />}>
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Navigate to="products" replace />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
