"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";

export default function ImageGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [active, setActive]     = useState(0);
  const [lightbox, setLightbox] = useState(false);

  function prev(e?: React.MouseEvent) {
    e?.stopPropagation();
    setActive((a) => (a - 1 + images.length) % images.length);
  }
  function next(e?: React.MouseEvent) {
    e?.stopPropagation();
    setActive((a) => (a + 1) % images.length);
  }

  // Keyboard navigation
  useEffect(() => {
    if (!lightbox) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft")  prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape")     setLightbox(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightbox, images.length]);

  if (images.length === 0) return null;

  return (
    <>
      <div className="dp-gallery">
        {/* Thumbnail strip — left side */}
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

        {/* Main image */}
        <div className="dp-gallery-main">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[active]}
            alt={`${name} — image ${active + 1}`}
            className="dp-gallery-main-img"
            onClick={() => setLightbox(true)}
          />

          {/* Enlarge button */}
          <button
            className="dp-gallery-enlarge"
            onClick={() => setLightbox(true)}
            aria-label="Enlarge image"
            title="Click to enlarge"
          >
            <Maximize2 size={15} strokeWidth={2.2} />
            <span>Click to see full view</span>
          </button>

          {/* Prev / Next arrows */}
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
      </div>

      {/* ── Lightbox overlay ────────────────────────────────────────── */}
      {lightbox && (
        <div className="dp-lightbox" onClick={() => setLightbox(false)}>
          <div className="dp-lightbox-inner" onClick={(e) => e.stopPropagation()}>
            {/* Close */}
            <button className="dp-lightbox-close" onClick={() => setLightbox(false)} aria-label="Close">
              <X size={22} strokeWidth={2.2} />
            </button>

            {/* Main enlarged image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[active]}
              alt={`${name} — image ${active + 1}`}
              className="dp-lightbox-img"
            />

            {/* Prev / Next inside lightbox */}
            {images.length > 1 && (
              <>
                <button className="dp-lightbox-arrow dp-lightbox-arrow--prev" onClick={prev} aria-label="Previous">
                  <ChevronLeft size={28} strokeWidth={2} />
                </button>
                <button className="dp-lightbox-arrow dp-lightbox-arrow--next" onClick={next} aria-label="Next">
                  <ChevronRight size={28} strokeWidth={2} />
                </button>
                <div className="dp-lightbox-counter">{active + 1} / {images.length}</div>
              </>
            )}

            {/* Thumbnail strip inside lightbox */}
            {images.length > 1 && (
              <div className="dp-lightbox-thumbs">
                {images.map((url, idx) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={idx}
                    src={url}
                    alt={`thumbnail ${idx + 1}`}
                    className={`dp-lightbox-thumb${idx === active ? " active" : ""}`}
                    onClick={() => setActive(idx)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
