"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { Entry } from "../_content/entries";
import styles from "./experiences.module.css";

export function ExperienceGallery({
  entry,
}: {
  entry: Pick<Entry, "title" | "gallery">;
}) {
  const track = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const slides = entry.gallery?.length ? entry.gallery : [null, null, null];

  function goTo(index: number) {
    const viewport = track.current;
    if (!viewport) return;
    viewport.scrollTo({
      left: index * viewport.clientWidth,
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }

  return (
    <div
      className={styles.gallery}
      role="region"
      aria-roledescription="carousel"
      aria-label={`${entry.title} image gallery`}
    >
      <div
        className={styles.galleryTrack}
        ref={track}
        tabIndex={0}
        aria-label="Images. Use left and right arrow keys to browse."
        onScroll={() => {
          const viewport = track.current;
          if (viewport) {
            setCurrent(Math.round(viewport.scrollLeft / viewport.clientWidth));
          }
        }}
        onKeyDown={(event) => {
          if (event.target !== event.currentTarget) return;
          const index = {
            ArrowLeft: Math.max(0, current - 1),
            ArrowRight: Math.min(slides.length - 1, current + 1),
            Home: 0,
            End: slides.length - 1,
          }[event.key];
          if (index !== undefined) {
            event.preventDefault();
            goTo(index);
          }
        }}
      >
        {slides.map((photo, index) => (
          <div
            className={styles.slide}
            key={photo?.src ?? index}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${slides.length}${photo ? "" : ": image placeholder"}`}
            data-placeholder={!photo || undefined}
          >
            {photo ? (
              <Image
                src={photo.src}
                alt={photo.alt}
                unoptimized={photo.src.endsWith(".gif")}
                fill
                sizes="(max-width: 840px) 92vw, (min-width: 1050px) 400px, 720px"
              />
            ) : (
              <div className={styles.blankImage}>
                <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
                  <rect x="5" y="6" width="30" height="28" rx="6" />
                  <circle cx="15" cy="15" r="3" />
                  <path d="m6 29 9-9 7 7 5-5 8 8" />
                </svg>
                <span>Image placeholder</span>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className={styles.galleryControls}>
        <span
          className={styles.imageCount}
          aria-live="polite"
          aria-atomic="true"
        >
          <span className="sr-only">Image </span>
          {current + 1} / {slides.length}
        </span>
        <div className={styles.galleryDots} aria-label="Choose an image">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Show image ${index + 1}`}
              aria-pressed={current === index}
              onClick={() => goTo(index)}
            >
              <span />
            </button>
          ))}
        </div>
        <div className={styles.galleryArrows}>
          <button
            type="button"
            aria-label="Previous image"
            disabled={current === 0}
            onClick={() => goTo(current - 1)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m14 6-6 6 6 6" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Next image"
            disabled={current === slides.length - 1}
            onClick={() => goTo(current + 1)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m10 6 6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
