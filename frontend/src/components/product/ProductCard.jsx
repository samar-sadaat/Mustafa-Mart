import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/cartSlice";


function money(n) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "PKR" }).format(n);
}

export default function ProductCard({ p }) {
  const dispatch = useDispatch();

  const handleAdd = (p) => {
  console.log("p------> (1)", p);
    dispatch(
      addToCart({
        productId: p._id,
        title: p.title,
        price: p.price,
        image: p.images,
      })
    );
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-[0_18px_50px_rgba(0,0,0,0.25)]">
      <Link to={`/product/${p._id}`}>
        <img
          src={
            Array.isArray(p.images)
              ? p.images[0]
              : p.images || "/no-image.png"
          }
          alt={p.title}
          className="h-48 w-full object-cover"
        />
      </Link>

      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <Link to={`/product/${p._id}`} className="text-base font-extrabold hover:underline">
            {p.title}
          </Link>
          <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs">
            {p.category}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="font-semibold">{money(p.price)}</div>
          <button
            onClick={() => handleAdd(p)}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}