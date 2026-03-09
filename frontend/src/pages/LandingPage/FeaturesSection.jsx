import React from "react";
import { motion } from "framer-motion";
import { features } from "../../data/dataReview";
import { featuresContainer, featureItem } from "../../css/animations";

export default function FeaturesSection() {
  return (
    <section id="features" className="py-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold">Why shop on E-Mart?</h2>
          <p className="mt-2 text-sm text-slate-300">
            Everything you need: fast delivery, great prices, and secure checkout.
          </p>
        </div>
      </div>

      <motion.div
        variants={featuresContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.25 }}
        className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {features.map((f) => (
          <motion.div
            key={f.title}
            variants={featureItem}
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 220, damping: 18 }}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-5
              shadow-[0_18px_50px_rgba(0,0,0,0.20)]
              hover:border-violet-400/30 hover:bg-white/[0.06]"
          >
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="absolute -top-10 -right-10 h-28 w-28 rounded-full bg-violet-500/20 blur-2xl" />
              <div className="absolute -bottom-10 -left-10 h-28 w-28 rounded-full bg-sky-500/20 blur-2xl" />
            </div>

            <motion.div
              whileHover={{ rotate: 3, scale: 1.06 }}
              transition={{ type: "spring", stiffness: 260, damping: 16 }}
              className="relative text-2xl"
            >
              {f.icon}
            </motion.div>

            <div className="relative mt-3 text-base font-extrabold">{f.title}</div>
            <p className="relative mt-2 text-sm text-slate-300">{f.desc}</p>

            <div className="relative mt-4 h-px w-full bg-white/10 transition-colors duration-300 group-hover:bg-violet-400/30" />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}