"use client";

import { useEffect, useRef } from "react";

export function TileField() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = root.current!;
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const colors = ["#b6ceef", "#dbe2e8", "#f2f4f5", "#8cb1ec", "#527fc8"];
    const animations = new Set<Animation>();
    let tiles: {
      face: HTMLSpanElement;
      x: number;
      y: number;
    }[] = [];
    let resize: number | undefined;

    function cancel() {
      animations.forEach((animation) => animation.cancel());
      animations.clear();
      element.dataset.wave = "idle";
    }
    function build() {
      cancel();
      const size = Math.max(
        18,
        Math.ceil(Math.sqrt((innerWidth * innerHeight) / 3000)),
      );
      const cols = Math.ceil(innerWidth / size);
      const rows = Math.ceil(innerHeight / size);
      const fragment = document.createDocumentFragment();
      tiles = [];
      for (let i = 0; i < cols * rows; i++) {
        const tile = document.createElement("span");
        tile.className = "tile";
        tile.style.cssText = `left:${(i % cols) * size}px;top:${Math.floor(i / cols) * size}px;width:${size}px;height:${size}px`;
        const face = document.createElement("span");
        face.className = "tile-face";
        const color = colors[(i * 7 + Math.floor(i / cols)) % colors.length];
        face.style.setProperty("--tile-back", color);
        face.append(document.createElement("i"));
        tile.append(face);
        fragment.append(tile);
        tiles.push({
          face,
          x: ((i % cols) + 0.5) * size,
          y: (Math.floor(i / cols) + 0.5) * size,
        });
      }
      element.replaceChildren(fragment);
      element.dataset.tileCount = String(tiles.length);
    }
    function flip(tile: (typeof tiles)[number], delay: number, duration: number) {
      const animation = tile.face.animate(
        [
          { transform: "rotateY(0deg)" },
          { transform: "rotateY(180deg)", offset: 0.5 },
          { transform: "rotateY(360deg)" },
        ],
        { duration, delay, easing: "cubic-bezier(.25,.55,.4,1)" },
      );
      animations.add(animation);
      animation.onfinish = () => {
        animations.delete(animation);
        animation.cancel();
        if (!animations.size) element.dataset.wave = "idle";
      };
    }
    function wave(event: Event) {
      if (media.matches || document.hidden) return;
      cancel();
      const { x, y } = (event as CustomEvent<{ x: number; y: number }>).detail;
      element.dataset.wave = "active";
      tiles.forEach((tile) =>
        flip(tile, Math.hypot(tile.x - x, tile.y - y) / 1.2, 220),
      );
    }
    function stopIfHidden() {
      if (document.hidden) cancel();
    }
    function preferenceChange() {
      if (media.matches) cancel();
    }
    function onResize() {
      cancelAnimationFrame(resize ?? 0);
      resize = requestAnimationFrame(build);
    }
    build();
    window.addEventListener("resize", onResize);
    window.addEventListener("port:intro-complete", wave);
    window.addEventListener("port:cancel-intro", cancel);
    document.addEventListener("visibilitychange", stopIfHidden);
    media.addEventListener("change", preferenceChange);
    return () => {
      cancelAnimationFrame(resize ?? 0);
      cancel();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("port:intro-complete", wave);
      window.removeEventListener("port:cancel-intro", cancel);
      document.removeEventListener("visibilitychange", stopIfHidden);
      media.removeEventListener("change", preferenceChange);
    };
  }, []);
  return (
    <div
      ref={root}
      className="tile-field"
      aria-hidden="true"
      data-wave="idle"
    />
  );
}
