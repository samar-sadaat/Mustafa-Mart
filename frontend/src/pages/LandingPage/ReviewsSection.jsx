import React, { useEffect,useState } from "react";
import { motion } from "framer-motion";
import { reviews } from "../../data/dataReview";
import { sectionIn } from "../../css/animations";

export default function ReviewsSection() {
    const [i, setI] = useState(0);
    const [perView, setPerView] = useState(3);

    useEffect(() => {
        const update = () => {
            const w = window.innerWidth;
            setPerView(w >= 1024 ? 3 : w >= 768 ? 2 : 1);
        };
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, [setPerView]);

    const maxIndex = Math.max(0, reviews.length - perView);
    const atStart = i === 0;
    const atEnd = i === maxIndex;

    useEffect(() => {
        if (i > maxIndex) setI(maxIndex);
    }, [i, maxIndex, setI]);

    const next = () => setI((v) => Math.min(v + 1, maxIndex));
    const prev = () => setI((v) => Math.max(v - 1, 0));


    const trackX = `-${i * (100 / (perView || 1))}%`;
    const showDots = maxIndex > 0;

    return (
        <section id="reviews" className="py-10">
            <motion.div
                variants={sectionIn}
                initial="hidden"
                whileInView="show"
                viewport={{ once: false, amount: 0.25 }}
            >
                <div className="flex items-end justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-extrabold">Customers love E-Mart</h2>
                        <p className="mt-2 text-sm text-slate-300">
                            Trusted by shoppers for speed, selection, and service.
                        </p>
                    </div>
                </div>

                <div className="relative mt-5 overflow-hidden rounded-3xl">
                    <button
                        onClick={prev}
                        disabled={atStart}
                        className={`hidden md:grid absolute left-3 top-1/2 -translate-y-1/2 z-10 h-10 w-10 place-items-center
              rounded-full border border-white/10 bg-white/10 backdrop-blur text-white transition
              ${atStart ? "opacity-40 cursor-not-allowed" : "hover:bg-white/20"}`}
                        aria-label="Previous"
                    >
                        ←
                    </button>

                    <button
                        onClick={next}
                        disabled={atEnd}
                        className={`hidden md:grid absolute right-3 top-1/2 -translate-y-1/2 z-10 h-10 w-10 place-items-center
              rounded-full border border-white/10 bg-white/10 backdrop-blur text-white transition
              ${atEnd ? "opacity-40 cursor-not-allowed" : "hover:bg-white/20"}`}
                        aria-label="Next"
                    >
                        →
                    </button>

                    <motion.div
                        className="flex gap-4"
                        animate={{ x: trackX }}
                        transition={{ type: "spring", stiffness: 90, damping: 18 }}
                        style={{ width: `${(reviews.length * 100) / (perView || 1)}%` }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        onDragEnd={(e, info) => {
                            if (info.offset.x < -80 && !atEnd) next();
                            if (info.offset.x > 80 && !atStart) prev();
                        }}
                    >
                        {reviews.map((r) => (
                                <motion.div
                                    key={r.name}
                                    whileHover={{ y: -6, scale: 1.01 }}
                                    transition={{ type: "spring", stiffness: 220, damping: 18 }}
                                    className="group shrink-0"
                                    style={{ width: `calc(${100 / (perView || 1)}% - 12px)` }}
                                >
                                    <div className="h-full rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.20)] hover:bg-white/[0.06] transition">
                                        <div className="flex items-center gap-1">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                < span key={i} className={i < r.stars ? "text-yellow-300" : "text-white/20"}>
                                                    ★
                                                </span>
                                            ))}
                                        </div>
                                        <p className="mt-3 text-sm text-slate-200/90">“{r.text}”</p>
                                        <div className="mt-4">
                                            <div className="font-extrabold">{r.name}</div>
                                            <div className="text-xs text-slate-300">{r.role}</div>
                                        </div>
                                    </div>
                                </motion.div>
                        ))}
                    </motion.div>

                    {showDots && (
                        <div className="mt-4 flex items-center justify-center gap-3 md:hidden">
                            <button
                                onClick={prev}
                                disabled={atStart}
                                className={`rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm transition
                  ${atStart ? "opacity-40 cursor-not-allowed" : "hover:bg-white/10"}`}
                            >
                                Prev
                            </button>
                            <button
                                onClick={next}
                                disabled={atEnd}
                                className={`rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm transition
                  ${atEnd ? "opacity-40 cursor-not-allowed" : "hover:bg-white/10"}`}
                            >
                                Next
                            </button>
                        </div>
                    )}

                    {showDots && (
                        <div className="mt-4 flex items-center justify-center gap-2">
                            {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setI(idx)}
                                    className={`h-2 w-2 rounded-full transition ${idx === i ? "bg-violet-300" : "bg-white/20 hover:bg-white/35"
                                        }`}
                                    aria-label={`Go to slide ${idx + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </motion.div >
        </section >
    );
}