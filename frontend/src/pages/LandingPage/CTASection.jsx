import React from "react";
import { Link } from "react-router-dom";

export default function CTASection() {
  return (
    <section className="py-10">
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.35)] md:p-10">
        <div className="grid items-center gap-6 md:grid-cols-[1fr_auto]">
          <div>
            <h2 className="text-2xl font-extrabold md:text-3xl">Ready to start shopping?</h2>
            <p className="mt-2 text-sm text-slate-300 md:text-base">
              Browse categories, add to cart, and checkout securely — in minutes.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              to="/shop"
              className="rounded-xl border border-violet-400/30 bg-violet-500/25 px-5 py-3 text-sm font-semibold hover:bg-violet-500/35"
            >
              Start Shopping
            </Link>
            <button className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm hover:bg-white/10">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}