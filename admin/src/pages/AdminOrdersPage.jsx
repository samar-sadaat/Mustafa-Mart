import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { apiRequest, money } from "../utils/adminApi";

const statusOptions = ["pending", "processing", "shipped", "delivered", "cancelled"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await apiRequest("/order/all-orders");
      setOrders(data.orders || []);
    } catch (error) {
      if (error.message !== "Unauthorized") {

      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return orders;

    return orders.filter((o) => {
      const customerName =
        `${o.customer?.firstName || ""} ${o.customer?.lastName || ""}`.trim();

      return [
        o._id,
        o.status,
        o.paymentMethod,
        o.customer?.city,
        o.customer?.phone,
        customerName,
      ]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q));
    });
  }, [orders, query]);

  const updateOrderStatus = async (orderId, status) => {
    try {
      await apiRequest(`/order/update-status/${orderId}`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status } : order
        )
      );
    } catch (error) {
      if (error.message !== "Unauthorized") {
        console.log("error------> (1)", error);
        alert(error.message);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold text-white">Orders</h1>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search orders..."
            className="w-full rounded-2xl border border-slate-800 bg-slate-900 py-3 pl-9 pr-3 text-slate-100 outline-none"
          />
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 text-center text-slate-400">
          Loading orders...
        </div>
      ) : filteredOrders.length ? (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const customerName =
              `${order.customer?.firstName || ""} ${order.customer?.lastName || ""}`.trim() ||
              "Unknown Customer";

            return (
              <div
                key={order._id}
                className="rounded-2xl border border-slate-800 bg-slate-950 p-5"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-white">{customerName}</h3>
                    <p className="text-sm text-slate-400">Order ID: {order._id}</p>
                    <p className="text-sm text-slate-300">
                      {order.customer?.address}, {order.customer?.city}
                    </p>
                    <p className="text-sm text-slate-300">
                      Phone: {order.customer?.phone}
                    </p>
                    <p className="text-sm text-slate-300">
                      Payment: {order.paymentMethod}
                    </p>
                    <p className="text-sm text-slate-300">Status: {order.status}</p>
                    <p className="text-sm text-slate-300">Total: {money(order.total)}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {statusOptions.map((status) => (
                      <button
                        key={status}
                        onClick={() => updateOrderStatus(order._id, status)}
                        className={`rounded-xl px-3 py-2 text-white ${order.status === status
                            ? "bg-violet-600 hover:bg-violet-500"
                            : "bg-slate-800 hover:bg-slate-700"
                          }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[500px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="px-3 py-2">Product</th>
                        <th className="px-3 py-2">Price</th>
                        <th className="px-3 py-2">Qty</th>
                        <th className="px-3 py-2">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(order.items || []).map((item, index) => (
                        <tr
                          key={`${order._id}-${index}`}
                          className="border-b border-slate-900/70"
                        >
                          <td className="px-3 py-3 text-slate-200">{item.name}</td>
                          <td className="px-3 py-3 text-slate-300">{money(item.price)}</td>
                          <td className="px-3 py-3 text-slate-300">{item.quantity}</td>
                          <td className="px-3 py-3 text-slate-300">
                            {money(item.price * item.quantity)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 text-center text-slate-400">
          No orders found.
        </div>
      )}
    </div>
  );
}
