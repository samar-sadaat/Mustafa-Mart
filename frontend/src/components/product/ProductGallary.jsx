import React, { useMemo, useState } from "react";

export default function ProductGallery({ p }) {
  const images = useMemo(() => {
    // normalize to array safely
    if (!p?.images) return [];
    return Array.isArray(p.images) ? p.images : [p.images];
  }, [p?.images]);

  const [activeIndex, setActiveIndex] = useState(0);

  const safeActive = images[activeIndex] || images[0] || "/no-image.png";

  const goPrev = () =>
    setActiveIndex((i) => (i - 1 + images.length) % images.length);

  const goNext = () => setActiveIndex((i) => (i + 1) % images.length);

  if (images.length <= 1) {
    return (
      <img
        src={safeActive}
        alt={p?.title}
        className="h-[420px] w-full object-cover rounded-xl"
      />
    );
  }

  return (
    <div className="flex gap-4">
      {/* Left thumbnails */}
      <div className="flex flex-col gap-3 w-20">
        {images.slice(0, 4).map((img, idx) => (
          <button
            key={img + idx}
            type="button"
            onClick={() => setActiveIndex(idx)}
            className={`rounded-lg overflow-hidden border cursor-pointer ${
              idx === activeIndex ? "border-black" : "border-transparent"
            }`}
          >
            <img
              src={img}
              alt={`${p?.title} preview ${idx + 1}`}
              className="h-20 w-20 object-cover"
            />
          </button>
        ))}
      </div>

      {/* Main image + slider controls */}
      <div className="relative flex-1">
        <img
          src={safeActive}
          alt={p?.title}
          className="h-[420px] w-full object-cover rounded-xl"
        />

        {/* Prev/Next buttons */}
        <button
          type="button"
          onClick={goPrev}
          className="text-black text-4xl absolute left-3 top-1/2 -translate-y-1/2 px-3 rounded-full cursor-pointer"
          aria-label="Previous image"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={goNext}
          className="text-black text-4xl absolute right-3 top-1/2 -translate-y-1/2 px-3 rounded-full cursor-pointer"
          aria-label="Next image"
        >
          ›
        </button>

        {/* Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {images.slice(0, 4).map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`h-2.5 w-2.5 rounded-full cursor-pointer ${
                idx === activeIndex ? "bg-black" : "bg-white/70"
              }`}
              aria-label={`Go to image ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}