import { Link, useParams } from "react-router-dom";
import ProductGallery from "../../components/product/ProductGallary";
import { useEffect, useState } from "react";
import { api } from "../../api/api";
import Container from "../../components/layout/Container";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/cartSlice";

const capitalizeWords = (text) => {
  if (!text) return "-";
  return text
    .replaceAll("_", " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

function money(n) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "PKR" }).format(n);
}

export default function ProductPage() {
  const { id } = useParams();
  const [p, setP] = useState(null);
  const dispatch = useDispatch();

  const handleAdd = (p) => {
    dispatch(
      addToCart({
        productId: p._id,
        title: p.title,
        price: p.price,
        image: p.images,
      })
    );
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/product/${id}`);
        setP(res.data.product);
      } catch (e) {
        setP(null);
      }
    })();
  }, [id]);

  if (!p) {
    return (
      <Container>
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <div className="text-lg font-extrabold">Product not found</div>
          <Link to="/shop" className="mt-3 inline-block text-sm text-violet-200 hover:text-violet-100">
            Back to shop
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]">
          <ProductGallery p={p} />
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <Link to="/shop" className="text-sm text-slate-300 hover:text-white">
            ← Back to shop
          </Link>

          <h1 className="mt-3 text-3xl font-extrabold">{capitalizeWords(p.title)}</h1>
          <div className="mt-2 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs">
            {capitalizeWords(p.category)}
          </div>

          <div className="mt-4 text-2xl font-extrabold">{money(p.price)}</div>
          <p className="mt-3 text-sm leading-6 text-slate-300">{p.description}</p>

          <div className="mt-6 flex gap-2">
            <button
               onClick={() => handleAdd(p)}
              className="rounded-xl border border-violet-400/30 bg-violet-500/25 px-5 py-3 text-sm font-semibold hover:bg-violet-500/35 cursor-pointer"
            >
              Add to Cart
            </button>
            <Link
              to="/cart"
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm hover:bg-white/10"
            >
              View Cart
            </Link>
          </div>
        </div>
      </div>
    </Container>
  );
}