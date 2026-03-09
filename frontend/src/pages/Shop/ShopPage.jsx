import React, { useEffect, useMemo, useState } from "react";
import Container from "../../components/layout/Container";
import ProductGrid from "../../components/product/ProductGrid";
import { api } from "../../api/api.js"


export default function ShopPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/product");
        setProducts(res.data.products || []);
      } catch (e) {
        setProducts([]);
      }
    })();
  }, []);

  const categories = useMemo(() => {
    const s = new Set(products.map((p) => p.category));
    return ["All", ...Array.from(s)];
  }, [products]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return products.filter((p) => {
      const matchesCat = cat === "All" || p.category === cat;
      const matchesQ = !query || p.name.toLowerCase().includes(query);
      return matchesCat && matchesQ;
    });
  }, [q, cat, products]);

  return (
    <Container>
      <div className="space-y-5">
        <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
          <h1 className="text-2xl font-extrabold">Shop</h1>
          <p className="mt-1 text-sm text-slate-300">Browse and add products to cart.</p>

          <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_240px]">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products…"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-violet-400/60"
            />
            <select
              value={cat}
              onChange={(e) => setCat(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm outline-none focus:border-violet-400/60"
            >
              {categories.map((c) => (
                <option key={c} value={c} className="bg-slate-900">
                  {c}
                </option>
              ))}
            </select>
          </div>
        </section>

        <ProductGrid products={filtered} />
      </div>
    </Container>
  );
}