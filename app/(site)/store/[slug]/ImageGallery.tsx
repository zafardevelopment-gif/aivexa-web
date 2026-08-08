"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ImageGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [active, setActive] = useState(0);

  if (images.length === 0) return null;

  function prev() { setActive((a) => (a - 1 + images.length) % images.length); }
  function next() { setActive((a) => (a + 1) % images.length); }

  return (
    <div className="dp-gallery">
      {/* Main image */}
      <div className="dp-gallery-main">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[active]}
          alt={`${name} — image ${active + 1}`}
          className="dp-gallery-main-img"
        />

        {/* Prev / Next arrows — only if more than 1 image */}
        {images.length > 1 && (
          <>
            <button className="dp-gallery-arrow dp-gallery-arrow--prev" onClick={prev} aria-label="Previous image">
              <ChevronLeft size={20} strokeWidth={2.2} />
            </button>
            <button className="dp-gallery-arrow dp-gallery-arrow--next" onClick={next} aria-label="Next image">
              <ChevronRight size={20} strokeWidth={2.2} />
            </button>
            <div className="dp-gallery-counter">{active + 1} / {images.length}</div>
          </>
        )}
      </div>

      {/* Thumbnail strip — only if more than 1 image */}
      {images.length > 1 && (
        <div className="dp-gallery-thumbs">
          {images.map((url, idx) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={idx}
              src={url}
              alt={`thumbnail ${idx + 1}`}
              className={`dp-gallery-thumb${idx === active ? " active" : ""}`}
              onClick={() => setActive(idx)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
