"use client";

import { useEffect, useRef } from "react";

export function StudyClip({
  src,
  poster,
  caption,
}: {
  src: string;
  poster: string;
  caption: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let inView = false;

    function updatePlayback() {
      if (reducedMotion.matches || !inView) {
        video.pause();
        return;
      }
      void video.play().catch(() => {});
    }

    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      updatePlayback();
    });

    function handleMotionChange() {
      if (reducedMotion.matches) video.load();
      updatePlayback();
    }

    observer.observe(video);
    reducedMotion.addEventListener("change", handleMotionChange);
    return () => {
      observer.disconnect();
      reducedMotion.removeEventListener("change", handleMotionChange);
    };
  }, []);

  return (
    <figure className="study-clip">
      <video
        ref={videoRef}
        aria-label={caption}
        src={src}
        poster={poster}
        width={800}
        height={450}
        preload="none"
        muted
        playsInline
        loop
        disablePictureInPicture
        disableRemotePlayback
      />
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
