import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { heroContainer, heroItem } from "../../css/animations";

export default function HeroSection() {
  return (
    <motion.section
      variants={heroContainer}
      initial="hidden"
      animate="show"
      className="grid py-7 gap-8 md:grid-cols-2"
    >
      <motion.div variants={heroContainer} className="space-y-5">
        <motion.div
          variants={heroItem}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200"
        >
          <motion.span
            className="text-violet-300"
            animate={{ opacity: [0.4, 1, 0.4], scale: [0.95, 1.1, 0.95] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            ●
          </motion.span>
          New: Daily Deals + Fast Delivery
        </motion.div>

        <motion.h1 variants={heroItem} className="text-4xl font-extrabold leading-tight md:text-5xl">
          Your online mart for{" "}
          <span className="bg-gradient-to-r from-violet-300 to-sky-300 bg-clip-text text-transparent">
            everything
          </span>{" "}
          you need.
        </motion.h1>

        <motion.p variants={heroItem} className="text-sm leading-6 text-slate-300 md:text-base">
          Discover groceries, electronics, fashion, and home essentials all in one place. Add to
          cart, checkout quickly, and get your order delivered safely.
        </motion.p>

        <motion.div variants={heroItem} className="flex flex-col gap-2 sm:flex-row">
          <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
            <Link
              to="/shop"
              className="inline-block rounded-xl border border-violet-400/30 bg-violet-500/25 px-4 py-3 text-sm font-semibold hover:bg-violet-500/35"
            >
              Browse Products
            </Link>
          </motion.div>

          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm hover:bg-white/10"
          >
            <a href="#deals"> View Deals </a>
          </motion.button>
        </motion.div>

        <motion.div variants={heroItem} className="grid grid-cols-3 gap-3 pt-2">
          {[
            { value: "10k+", label: "Products" },
            { value: "4.8★", label: "Avg rating" },
            { value: "24/7", label: "Support" },
          ].map((s) => (
            <motion.div
              key={s.label}
              whileHover={{ y: -3 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
            >
              <div className="text-xl font-extrabold">{s.value}</div>
              <div className="text-xs text-slate-300">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      <img
        src="/logo.png"
        alt="heroImg"
        className="w-full max-w-lg mx-auto animate-float transition duration-600 hover:scale-105 hover:drop-shadow-[0_20px_40px_rgba(139,92,246,0.5)]"
      />
    </motion.section>
  );
}