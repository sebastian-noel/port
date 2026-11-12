"use client";

import { useEffect, useRef, type ReactNode } from "react";
import styles from "./showcase.module.css";

export function ShowcaseMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    if (!("IntersectionObserver" in window)) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const wide = matchMedia("(min-width: 1200px)");
    const connection = (
      navigator as Navigator & {
        connection?: { saveData?: boolean };
      }
    ).connection;
    const animations = new Set<Animation>();
    const videos = [...element.querySelectorAll<HTMLVideoElement>("video")];
    const visibleVideos = new Set<HTMLVideoElement>();
    const revealTargets = [
      ...element.querySelectorAll<HTMLElement>(
        "[data-project], [data-experience]",
      ),
    ];

    // Only enhance content below the viewport; restored positions stay readable.
    if (!reduced.matches) {
      revealTargets.forEach((target) => {
        if (
          !target.dataset.revealed &&
          target.getBoundingClientRect().top >= innerHeight
        ) {
          target.dataset.pending = "true";
        }
      });
    }

    function syncMotion() {
      if (!element) return;
      const stopped = reduced.matches || document.hidden;
      element.dataset.motion = stopped ? "paused" : "playing";
      if (reduced.matches) {
        revealTargets.forEach((target) => {
          delete target.dataset.pending;
        });
      }
      for (const animation of animations) {
        if (reduced.matches) animation.finish();
        else if (document.hidden) animation.pause();
        else animation.play();
      }
      for (const video of videos) {
        if (stopped || connection?.saveData || !visibleVideos.has(video)) {
          video.pause();
          continue;
        }
        // Attach sources only when a visible clip is allowed to play.
        if (!video.getAttribute("src") && video.dataset.src) {
          video.src = video.dataset.src;
        }
        void video.play().then(
          () => {
            delete video.dataset.unavailable;
          },
          () => {
            video.dataset.unavailable = "true";
          },
        );
      }
    }

    function reveal(target: HTMLElement, delay = 0) {
      if (target.dataset.revealed) return;
      target.dataset.revealed = "true";
      delete target.dataset.pending;
      if (reduced.matches || target.getBoundingClientRect().top < 80) return;
      const animation = target.animate(
        [
          { opacity: 0, transform: "translateY(56px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        {
          duration: 850,
          delay,
          easing: "cubic-bezier(.16,1,.3,1)",
          fill: "both",
        },
      );
      animations.add(animation);
      void animation.finished.then(
        () => {
          animations.delete(animation);
          animation.cancel();
        },
        () => {},
      );
    }

    const reveals = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const target = entry.target as HTMLElement;
          if (target.hasAttribute("data-project-stage")) {
            if (!wide.matches) continue;
            target
              .querySelectorAll<HTMLElement>("[data-project]")
              .forEach((project, index) => reveal(project, index * 180));
          } else {
            if (wide.matches && target.hasAttribute("data-project")) continue;
            reveal(target);
          }
          reveals.unobserve(target);
        }
      },
      { threshold: 0.12 },
    );
    element
      .querySelectorAll<HTMLElement>(
        "[data-project-stage], [data-project], [data-experience]",
      )
      .forEach((target) => reveals.observe(target));

    const playback = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const media = entry.target as HTMLElement;
          const video = media.querySelector("video");
          if (!video) continue;
          if (entry.isIntersecting) visibleVideos.add(video);
          else visibleVideos.delete(video);
        }
        syncMotion();
      },
      { threshold: 0.15 },
    );
    element
      .querySelectorAll("[data-showcase-media]")
      .forEach((media) => playback.observe(media));

    function revealFocus(event: FocusEvent) {
      const target = (event.target as HTMLElement).closest<HTMLElement>(
        "[data-project], [data-experience]",
      );
      if (!target) return;
      target.dataset.revealed = "true";
      delete target.dataset.pending;
      target.getAnimations().forEach((animation) => animation.finish());
    }

    syncMotion();
    reduced.addEventListener("change", syncMotion);
    document.addEventListener("visibilitychange", syncMotion);
    element.addEventListener("focusin", revealFocus);
    return () => {
      reveals.disconnect();
      playback.disconnect();
      reduced.removeEventListener("change", syncMotion);
      document.removeEventListener("visibilitychange", syncMotion);
      element.removeEventListener("focusin", revealFocus);
      animations.forEach((animation) => animation.cancel());
      videos.forEach((video) => video.pause());
      revealTargets.forEach((target) => {
        delete target.dataset.pending;
      });
    };
  }, []);

  return (
    <div className={styles.showcase} ref={root}>
      {children}
    </div>
  );
}
