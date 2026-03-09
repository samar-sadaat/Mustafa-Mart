import React from "react";

export default function DealsSection() {
  return (
    <section id="deals" className="py-10">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-violet-500/25 to-sky-500/15 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs">
            🔥 Limited Time
          </div>
          <h3 className="mt-3 text-2xl font-extrabold">Mega Deals Week</h3>
          <p className="mt-2 text-sm text-slate-200/90">
            Save on top categories with bundle discounts and flash sales.
          </p>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <button className="rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-semibold hover:bg-white/15">
              View Offers
            </button>
            <button className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm hover:bg-white/10">
              Join Membership
            </button>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
          <div className="text-sm font-semibold">Fast checkout</div>
          <p className="mt-2 text-sm text-slate-300">
            Add items to cart and checkout in seconds. Supports COD and card payments.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <div className="text-sm font-extrabold">Free returns</div>
              <div className="mt-1 text-xs text-slate-300">7-day easy returns</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <div className="text-sm font-extrabold">Cash on delivery</div>
              <div className="mt-1 text-xs text-slate-300">Pay after delivery</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <div className="text-sm font-extrabold">Secure payments</div>
              <div className="mt-1 text-xs text-slate-300">Encrypted transactions</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <div className="text-sm font-extrabold">Order tracking</div>
              <div className="mt-1 text-xs text-slate-300">Live status updates</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}