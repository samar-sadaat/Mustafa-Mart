// import { useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Container from "../../components/layout/Container";
// import { useDispatch, useSelector } from "react-redux";
// import { clearCart } from "../../store/cartSlice";

// function money(n) {
//   return new Intl.NumberFormat(undefined, {
//     style: "currency",
//     currency: "PKR",
//   }).format(n);
// }

// export default function PaymentPage() {
//   const nav = useNavigate();
//   const dispatch = useDispatch();

//   const items = useSelector((state) => state.cart.items);
//   const shipping = useSelector((state) => state.cart.shipping);

//   const [placed, setPlaced] = useState(false);
//   const [payment, setPayment] = useState({
//     method: "COD",
//     cardName: "",
//     cardNumber: "",
//     expiry: "",
//     cvc: "",
//   });

//   const lines = useMemo(() => {
//     return items.map((item) => ({
//       ...item,
//       lineTotal: item.price * item.qty,
//     }));
//   }, [items]);

//   const subtotal = lines.reduce((sum, item) => sum + item.lineTotal, 0);

//   const placeOrder = () => {
//     if (payment.method === "CARD") {
//       if (
//         !payment.cardName.trim() ||
//         !payment.cardNumber.trim() ||
//         !payment.expiry.trim() ||
//         !payment.cvc.trim()
//       ) {
//         return;
//       }
//     }

//     setPlaced(true);
//     dispatch(clearCart());

//     setTimeout(() => {
//       nav("/shop");
//     }, 500);
//   };

//   if (lines.length === 0) {
//     return (
//       <Container>
//         <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
//           <div className="font-semibold">Your cart is empty.</div>
//         </div>
//       </Container>
//     );
//   }

//   return (
//     <Container>
//       <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
//         <div className="space-y-4">
//           <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
//             <h1 className="text-2xl font-extrabold">Payment</h1>
//             <p className="mt-1 text-sm text-slate-300">
//               Choose your payment method.
//             </p>
//           </section>

//           <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 space-y-4">
//             <div className="grid gap-2 sm:grid-cols-2">
//               <button
//                 type="button"
//                 onClick={() =>
//                   setPayment((prev) => ({ ...prev, method: "COD" }))
//                 }
//                 className={`rounded-xl border px-4 py-3 text-sm transition ${
//                   payment.method === "COD"
//                     ? "border-violet-400/40 bg-violet-500/20"
//                     : "border-white/10 bg-white/5 hover:bg-white/10"
//                 }`}
//               >
//                 Cash on Delivery
//               </button>

//               <button
//                 type="button"
//                 onClick={() =>
//                   setPayment((prev) => ({ ...prev, method: "CARD" }))
//                 }
//                 className={`rounded-xl border px-4 py-3 text-sm transition ${
//                   payment.method === "CARD"
//                     ? "border-violet-400/40 bg-violet-500/20"
//                     : "border-white/10 bg-white/5 hover:bg-white/10"
//                 }`}
//               >
//                 Card Payment
//               </button>
//             </div>

//             {payment.method === "CARD" && (
//               <div className="space-y-3">
//                 <input
//                   value={payment.cardName}
//                   onChange={(e) =>
//                     setPayment((prev) => ({
//                       ...prev,
//                       cardName: e.target.value,
//                     }))
//                   }
//                   placeholder="Name on card"
//                   className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm outline-none"
//                 />

//                 <input
//                   value={payment.cardNumber}
//                   onChange={(e) =>
//                     setPayment((prev) => ({
//                       ...prev,
//                       cardNumber: e.target.value,
//                     }))
//                   }
//                   placeholder="Card number"
//                   className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm outline-none"
//                 />

//                 <div className="grid gap-3 sm:grid-cols-2">
//                   <input
//                     value={payment.expiry}
//                     onChange={(e) =>
//                       setPayment((prev) => ({
//                         ...prev,
//                         expiry: e.target.value,
//                       }))
//                     }
//                     placeholder="MM/YY"
//                     className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm outline-none"
//                   />

//                   <input
//                     value={payment.cvc}
//                     onChange={(e) =>
//                       setPayment((prev) => ({
//                         ...prev,
//                         cvc: e.target.value,
//                       }))
//                     }
//                     placeholder="CVC"
//                     className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm outline-none"
//                   />
//                 </div>
//               </div>
//             )}

//             <button
//               type="button"
//               onClick={placeOrder}
//               className="w-full rounded-xl border border-violet-400/30 bg-violet-500/25 px-4 py-3 text-sm font-semibold hover:bg-violet-500/35"
//             >
//               Place Order
//             </button>

//             {placed && (
//               <div className="text-sm text-slate-300">
//                 Order placed! Redirecting to shop…
//               </div>
//             )}
//           </div>
//         </div>

//         <aside className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 h-fit">
//           <div className="text-sm font-semibold">Order Summary</div>

//           <div className="mt-3 space-y-3">
//             {lines.map((item) => (
//               <div
//                 key={item.productId}
//                 className="flex items-center justify-between text-sm"
//               >
//                 <span className="text-slate-300">
//                   {item.name} × {item.qty}
//                 </span>
//                 <span className="text-slate-200 font-medium">
//                   {money(item.lineTotal)}
//                 </span>
//               </div>
//             ))}
//           </div>

//           <div className="mt-4 space-y-2 text-sm text-slate-300 border-t border-white/10 pt-4">
//             <div>
//               Ship to:{" "}
//               <span className="text-slate-200">
//                 {shipping?.fullName || "N/A"}
//               </span>
//             </div>
//             <div>
//               Phone:{" "}
//               <span className="text-slate-200">
//                 {shipping?.phone || "N/A"}
//               </span>
//             </div>
//             <div>
//               Address:{" "}
//               <span className="text-slate-200">
//                 {shipping?.address || "N/A"}
//               </span>
//             </div>
//             <div>
//               City:{" "}
//               <span className="text-slate-200">
//                 {shipping?.city || "N/A"}
//               </span>
//             </div>
//           </div>

//           <div className="mt-4 border-t border-white/10 pt-4">
//             <div className="flex items-center justify-between text-sm">
//               <span className="text-slate-300">Subtotal</span>
//               <span className="font-semibold">{money(subtotal)}</span>
//             </div>
//           </div>
//         </aside>
//       </div>
//     </Container>
//   );
// }
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../../components/layout/Container";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../../store/cartSlice";
import toast from "react-hot-toast";
import { api } from "../../api/api";

function money(n) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "PKR",
  }).format(n);
}

export default function PaymentPage() {
  const nav = useNavigate();
  const dispatch = useDispatch();

  const items = useSelector((state) => state.cart.items);
  const shipping = useSelector((state) => state.cart.shipping);

  const [placed, setPlaced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [payment, setPayment] = useState({
    method: "COD",
  });

  const lines = useMemo(() => {
    return items.map((item) => ({
      ...item,
      lineTotal: item.price * item.qty,
    }));
  }, [items]);

  const subtotal = lines.reduce((sum, item) => sum + item.lineTotal, 0);

  const handleCardClick = () => {
    toast.error(
      "Sorry, card payment is temporarily unavailable. Please use Cash on Delivery."
    );
  };

  const placeOrder = async () => {
    if (!shipping?.fullName || !shipping?.phone || !shipping?.address || !shipping?.city) {
      return toast.error("Please complete shipping details first");
    }

    try {
      setLoading(true);

      const payload = {
        items: lines.map((item) => ({
          productId: item.productId,
          name: item.title,
          price: item.price,
          quantity: item.qty,
        })),
        shipping,
        paymentMethod: "COD",
      };

      const res = await api.post("/order/create", payload);

      toast.success(res.data.message || "Order placed successfully");
      setPlaced(true);
      dispatch(clearCart());

      setTimeout(() => {
        nav("/shop");
      }, 700);
    } catch (err) {
      toast.error(
        err?.response?.data?.message || err.message || "Failed to place order"
      );
    } finally {
      setLoading(false);
    }
  };

  if (lines.length === 0) {
    return (
      <Container>
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <div className="font-semibold">Your cart is empty.</div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <h1 className="text-2xl font-extrabold">Payment</h1>
            <p className="mt-1 text-sm text-slate-300">
              Choose your payment method.
            </p>
          </section>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 space-y-4">
            <div className="grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={() =>
                  setPayment((prev) => ({ ...prev, method: "COD" }))
                }
                className={`rounded-xl border px-4 py-3 text-sm transition ${
                  payment.method === "COD"
                    ? "border-violet-400/40 bg-violet-500/20"
                    : "border-white/10 bg-white/5 hover:bg-white/10"
                }`}
              >
                Cash on Delivery
              </button>

              <button
                type="button"
                onClick={handleCardClick}
                className="cursor-not-allowed rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-400 opacity-60"
              >
                Card Payment
              </button>
            </div>

            <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-200">
              Card payment is temporarily unavailable. We apologize for the
              inconvenience. Please use Cash on Delivery.
            </div>

            <button
              type="button"
              onClick={placeOrder}
              disabled={loading}
              className="w-full rounded-xl border border-violet-400/30 bg-violet-500/25 px-4 py-3 text-sm font-semibold hover:bg-violet-500/35 disabled:opacity-60"
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>

            {placed && (
              <div className="text-sm text-slate-300">
                Order placed! Redirecting to shop…
              </div>
            )}
          </div>
        </div>

        <aside className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 h-fit">
          <div className="text-sm font-semibold">Order Summary</div>

          <div className="mt-3 space-y-3">
            {lines.map((item) => (
              <div
                key={item.productId}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-slate-300">
                  {item.name} × {item.qty}
                </span>
                <span className="text-slate-200 font-medium">
                  {money(item.lineTotal)}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-2 text-sm text-slate-300 border-t border-white/10 pt-4">
            <div>
              Ship to:{" "}
              <span className="text-slate-200">
                {shipping?.fullName || "N/A"}
              </span>
            </div>
            <div>
              Phone:{" "}
              <span className="text-slate-200">
                {shipping?.phone || "N/A"}
              </span>
            </div>
            <div>
              Address:{" "}
              <span className="text-slate-200">
                {shipping?.address || "N/A"}
              </span>
            </div>
            <div>
              City:{" "}
              <span className="text-slate-200">
                {shipping?.city || "N/A"}
              </span>
            </div>
          </div>

          <div className="mt-4 border-t border-white/10 pt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-300">Subtotal</span>
              <span className="font-semibold">{money(subtotal)}</span>
            </div>
          </div>
        </aside>
      </div>
    </Container>
  );
}