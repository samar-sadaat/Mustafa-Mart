import { Link, useLocation, useNavigate } from "react-router-dom";
import { Package, ShoppingBag, LogOut } from "lucide-react";
import { apiRequest } from "../utils/adminApi";

export default function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const linkClass = (path) =>
    `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
      location.pathname === path
        ? "bg-violet-600 text-white"
        : "text-slate-300 hover:bg-slate-800 hover:text-white"
    }`;

  const logout = async () => {
    try {
      try {
        await apiRequest("/admin/logout", { method: "POST" });
      } catch (err) {
        // optional backend logout route
      }

      localStorage.removeItem("adminAuth");
      navigate("/admin/login");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <aside className="w-full rounded-3xl border border-slate-800 bg-slate-950 p-4 lg:w-72">
      <div className="mb-6 px-2">
        <p className="text-xs uppercase tracking-[0.25em] text-violet-300">
          Admin Panel
        </p>
        <h2 className="mt-2 text-2xl font-bold text-white">Mustafa Mart</h2>
        <p className="mt-1 text-sm text-slate-400">
          Manage products and orders
        </p>
      </div>

      <nav className="space-y-2">
        <Link to="/admin/products" className={linkClass("/admin/products")}>
          <Package className="h-4 w-4" />
          Products
        </Link>

        <Link to="/admin/orders" className={linkClass("/admin/orders")}>
          <ShoppingBag className="h-4 w-4" />
          Orders
        </Link>
      </nav>

      <div className="mt-6 border-t border-slate-800 pt-4">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-2xl bg-slate-800 px-4 py-3 text-sm font-medium text-slate-200 hover:bg-red-600 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
