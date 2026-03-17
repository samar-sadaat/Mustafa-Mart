import React, { useEffect, useMemo, useState } from "react";

const getImageUrl = (path) => {
  if (!path) return "/no-image.png";
  if (path.startsWith("http")) return path;
  return `${import.meta.env.VITE_BACKEND_URL}${path}`;
};

export default function ProductGallery({ p }) {
  const images = useMemo(() => {
    if (!p?.images) return [];
    const rawImages = Array.isArray(p.images) ? p.images : [p.images];
    return rawImages.map((img) => getImageUrl(img));
  }, [p?.images]);

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [p?._id, p?.images]);

  const safeActive = images[activeIndex] || images[0] || "/no-image.png";

  const goPrev = () => {
    if (images.length <= 1) return;
    setActiveIndex((i) => (i - 1 + images.length) % images.length);
  };

  const goNext = () => {
    if (images.length <= 1) return;
    setActiveIndex((i) => (i + 1) % images.length);
  };

  if (images.length <= 1) {
    return (
      <img
        src={safeActive}
        alt={p?.title || "product"}
        onError={(e) => {
          e.currentTarget.src = "/no-image.png";
        }}
        className="h-[420px] w-full rounded-xl object-cover"
      />
    );
  }

  return (
    <div className="flex gap-4">
      <div className="flex w-20 flex-col gap-3">
        {images.slice(0, 4).map((img, idx) => (
          <button
            key={`${img}-${idx}`}
            type="button"
            onClick={() => setActiveIndex(idx)}
            className={`cursor-pointer overflow-hidden rounded-lg border ${
              idx === activeIndex ? "border-black" : "border-transparent"
            }`}
          >
            <img
              src={img}
              alt={`${p?.title || "product"} preview ${idx + 1}`}
              onError={(e) => {
                e.currentTarget.src = "/no-image.png";
              }}
              className="h-20 w-20 object-cover"
            />
          </button>
        ))}
      </div>

      <div className="relative flex-1">
        <img
          src={safeActive}
          alt={p?.title || "product"}
          onError={(e) => {
            e.currentTarget.src = "/no-image.png";
          }}
          className="h-[420px] w-full rounded-xl object-cover"
        />

        <button
          type="button"
          onClick={goPrev}
          className="absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-full px-3 text-4xl text-black"
          aria-label="Previous image"
        >
          ‹
        </button>

        <button
          type="button"
          onClick={goNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-full px-3 text-4xl text-black"
          aria-label="Next image"
        >
          ›
        </button>

        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
          {images.slice(0, 4).map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`h-2.5 w-2.5 cursor-pointer rounded-full ${
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