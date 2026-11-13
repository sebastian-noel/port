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

    function reveal(target: HTMLElement, delay = 0, duration?: number) {
      if (target.dataset.revealed) return;
      target.dataset.revealed = "true";
      const content =
        target.querySelector<HTMLElement>("[data-project-reveal]") ?? target;
      const skeleton = target.querySelector<HTMLElement>(
        "[data-project-skeleton]",
      );
      if (
        reduced.matches ||
        !target.dataset.pending ||
        target.getBoundingClientRect().top < 80
      ) {
        delete target.dataset.pending;
        return;
      }
      const skeletonFade = skeleton ? 110 : 0;
      const animation = content.animate(
        [
          { opacity: 0, transform: "translateY(56px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        {
          duration: duration ?? (skeleton ? 750 : 850),
          delay: delay + skeletonFade,
          easing: "cubic-bezier(.16,1,.3,1)",
          fill: "both",
        },
      );
      animations.add(animation);
      let fade: Animation | undefined;
      if (skeleton) {
        fade = skeleton.animate([{ opacity: 1 }, { opacity: 0 }], {
          duration: skeletonFade,
          delay,
          easing: "ease-out",
          fill: "both",
        });
        animations.add(fade);
      }
      void animation.finished.then(
        () => {
          delete target.dataset.pending;
          if (fade) {
            animations.delete(fade);
            fade.cancel();
          }
          animations.delete(animation);
          animation.cancel();
        },
        () => {},
      );
    }

    const reveals = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const target = entry.target as HTMLElement;
          if (target.hasAttribute("data-project")) {
            target.dataset.skeletonVisible = String(entry.isIntersecting);
          }
          if (!entry.isIntersecting) continue;
          if (wide.matches && target.hasAttribute("data-project")) continue;
          reveal(target);
          reveals.unobserve(target);
        }
      },
      { threshold: 0.12 },
    );
    element
      .querySelectorAll<HTMLElement>("[data-project], [data-experience]")
      .forEach((target) => reveals.observe(target));

    const desktopReveal = new IntersectionObserver(
      (entries) => {
        if (!wide.matches || !entries.some((entry) => entry.isIntersecting))
          return;
        // Desktop pacing is independent of the mobile-first source order.
        ["recall", "greghouse", "permanence"].forEach((slug, index) => {
          const project = element.querySelector<HTMLElement>(
            `[data-project="${slug}"]`,
          );
          if (project) reveal(project, 100 + index * 1000, 950);
        });
        desktopReveal.disconnect();
      },
      { threshold: 0.2, rootMargin: "0px 0px -18% 0px" },
    );
    const stage = element.querySelector("[data-project-stage]");
    if (stage) desktopReveal.observe(stage);

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
      for (const animation of animations) {
        const effect = animation.effect;
        if (
          effect instanceof KeyframeEffect &&
          effect.target &&
          target.contains(effect.target)
        ) {
          animation.finish();
        }
      }
    }

    syncMotion();
    reduced.addEventListener("change", syncMotion);
    document.addEventListener("visibilitychange", syncMotion);
    element.addEventListener("focusin", revealFocus);
    return () => {
      reveals.disconnect();
      desktopReveal.disconnect();
      playback.disconnect();
      reduced.removeEventListener("change", syncMotion);
      document.removeEventListener("visibilitychange", syncMotion);
      element.removeEventListener("focusin", revealFocus);
      animations.forEach((animation) => animation.cancel());
      videos.forEach((video) => video.pause());
      revealTargets.forEach((target) => {
        delete target.dataset.pending;
        delete target.dataset.skeletonVisible;
      });
    };
  }, []);

  return (
    <div className={styles.showcase} ref={root}>
      {children}
    </div>
  );
}
