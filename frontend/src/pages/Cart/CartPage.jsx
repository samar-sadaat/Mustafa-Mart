import { Link, useNavigate } from "react-router-dom";
import Container from "../../components/layout/Container";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, increaseQty, decreaseQty } from "../../store/cartSlice";

function money(n) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "PKR",
  }).format(n);
}

export default function CartPage() {
  const nav = useNavigate();
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.items);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  return (
    <Container>
      <div className="space-y-5">
        <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <h1 className="text-2xl font-extrabold">Cart</h1>
          <p className="mt-1 text-sm text-slate-300">
            Review items before checkout.
          </p>
        </section>

        {cartItems.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <div className="font-semibold">Your cart is empty.</div>
            <Link
              to="/shop"
              className="mt-3 inline-block text-sm text-violet-200 hover:text-violet-100"
            >
              Go to shop
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.productId}
                  className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                >
                  <img
                    src={item.image[0]}
                    alt={item.title}
                    className="h-20 w-20 rounded-xl object-cover"
                  />

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-extrabold">{item.name}</div>
                      <div className="text-sm font-semibold">
                        {money(item.price * item.qty)}
                      </div>
                    </div>

                    <div className="mt-2 flex items-center gap-3">
                      <button
                        onClick={() => dispatch(decreaseQty(item.productId))}
                        className="px-2"
                      >
                        -
                      </button>

                      <span>{item.qty}</span>

                      <button
                        onClick={() => dispatch(increaseQty(item.productId))}
                        className="px-2"
                      >
                        +
                      </button>

                      <button
                        onClick={() =>
                          dispatch(removeFromCart(item.productId))
                        }
                        className="ml-auto rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <aside className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 h-fit">
              <div className="text-sm text-slate-300">Subtotal</div>
              <div className="mt-1 text-2xl font-extrabold">
                {money(subtotal)}
              </div>

              <button
                onClick={() => nav("/checkout/shipping")}
                className="mt-4 w-full rounded-xl border border-violet-400/30 bg-violet-500/25 px-4 py-3 text-sm font-semibold hover:bg-violet-500/35"
              >
                Continue to Shipping
              </button>

              <Link
                to="/shop"
                className="mt-2 block text-center rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm hover:bg-white/10"
              >
                Continue Shopping
              </Link>
            </aside>
          </div>
        )}
      </div>
    </Container>
  );
}