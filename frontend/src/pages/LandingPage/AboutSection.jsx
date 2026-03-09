import React from "react";

export default function AboutSection() {
  return (
    <section id="about" className="py-14">
      <div className="grid gap-10 md:grid-cols-2 items-center">
        <div className="relative flex justify-center">
          <div className="absolute -z-10 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl animate-pulse"></div>

          <img
            src="/mm.png"
            alt="About Online Mart"
            className="w-full max-w-md rounded-3xl border border-white/10 shadow-[0_18px_50px_rgba(0,0,0,0.35)] transition duration-500 hover:scale-105"
          />
        </div>

        <div>
          <h2 className="text-3xl font-extrabold">
            About{" "}
            <span className="bg-gradient-to-r from-violet-300 to-sky-300 bg-clip-text text-transparent">
              Mustafa Mart
            </span>
          </h2>

          <p className="mt-4 text-sm leading-6 text-slate-300 md:text-base">
            Mustafa Mart is built for you a modern, reliable, and fast shopping platform designed
            to bring everything you need into one trusted place. From groceries and fashion to
            electronics and home essentials, we make shopping simple, secure, and convenient.
          </p>

          <p className="mt-4 text-sm leading-6 text-slate-300 md:text-base">
            We are committed to quality products, transparent pricing, and secure transactions.
            Every order is handled with care to ensure safe delivery and complete customer
            satisfaction.
          </p>

          <p className="mt-4 text-sm leading-6 text-slate-300 md:text-base">
            Our goal is not just to sell products but to build trust and create a seamless online
            shopping experience you can rely on every time.
          </p>
        </div>
      </div>
    </section>
  );
}