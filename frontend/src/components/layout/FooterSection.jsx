import React from "react";

export default function FooterSection() {
  return (
    <footer className="border-t border-white/10 bg-[#0f172a] py-12">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 text-lg font-extrabold">
              <span className="h-3 w-3 rounded-full bg-violet-500" />
              Mustafa Mart
            </div>
            <p className="mt-4 text-sm text-slate-400 leading-6">
              Your trusted online mart for groceries, electronics, fashion, and daily essentials.
              Secure payments, fast delivery, and reliable customer support.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Shop</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-400">
              <li>
                <a href="/shop" className="hover:text-white transition">
                  All Products
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition">
                  Why Choose Us
                </a>
              </li>
              <li>
                <a href="#reviews" className="hover:text-white transition">
                  Customer Reviews
                </a>
              </li>
              <li>
                <a href="#deals" className="hover:text-white transition">
                  Deals & Offers
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Customer Service</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-400">
              <li>
                <a href="#" className="hover:text-white transition">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Shipping Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Returns & Refunds
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Contact Us</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-400">
              <li>Email: mustafa@mart.com</li>
              <li>
                Phone: +92 300 8460691
                <br />
                +92 339 0424216
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} E-Mart. All rights reserved.
        </div>
      </div>
    </footer>
  );
}