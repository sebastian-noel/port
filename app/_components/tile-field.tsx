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
      color: string;
    }[] = [];
    let paused = false;
    let resize: number | undefined;

    function cancel() {
      animations.forEach((animation) => animation.cancel());
      animations.clear();
      element.dataset.wave = "idle";
    }
    function build() {
      cancel();
      const size = Math.max(
        40,
        Math.ceil(Math.sqrt((innerWidth * innerHeight) / 650)),
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
        let noise = Math.imul(i + 1, 0x45d9f3b);
        noise = Math.imul(noise ^ (noise >>> 16), 0x45d9f3b);
        const highlighted = ((noise ^ (noise >>> 16)) >>> 0) % 101 < 5;
        const rest = highlighted ? "#365e95" : "transparent";
        face.style.setProperty("--tile-rest", rest);
        face.style.setProperty("--tile-back", color);
        face.append(document.createElement("i"), document.createElement("i"));
        tile.append(face);
        fragment.append(tile);
        tiles.push({
          face,
          x: ((i % cols) + 0.5) * size,
          y: (Math.floor(i / cols) + 0.5) * size,
          color,
        });
      }
      element.replaceChildren(fragment);
      element.dataset.tileCount = String(tiles.length);
    }
    function flip(tile: (typeof tiles)[number], delay = 0, duration = 900) {
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
      if (paused || media.matches || document.hidden) return;
      cancel();
      const { x, y } = (event as CustomEvent<{ x: number; y: number }>).detail;
      element.dataset.wave = "active";
      tiles.forEach((tile) =>
        flip(tile, Math.hypot(tile.x - x, tile.y - y) / 2.2, 850),
      );
    }
    function idleFlip() {
      if (paused || media.matches || document.hidden || animations.size) return;
      for (let i = 0; i < 3; i++)
        flip(tiles[Math.floor(Math.random() * tiles.length)], i * 120, 1300);
    }
    function stopIfHidden() {
      if (document.hidden) cancel();
    }
    function preferenceChange() {
      if (media.matches) cancel();
    }
    function pause(event: Event) {
      paused = (event as CustomEvent<boolean>).detail;
      if (paused) cancel();
    }
    function onResize() {
      cancelAnimationFrame(resize ?? 0);
      resize = requestAnimationFrame(build);
    }
    build();
    const idle = setInterval(idleFlip, 6500);
    window.addEventListener("resize", onResize);
    window.addEventListener("port:intro-complete", wave);
    window.addEventListener("port:cancel-intro", cancel);
    window.addEventListener("port:motion-paused", pause);
    document.addEventListener("visibilitychange", stopIfHidden);
    media.addEventListener("change", preferenceChange);
    return () => {
      clearInterval(idle);
      cancelAnimationFrame(resize ?? 0);
      cancel();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("port:intro-complete", wave);
      window.removeEventListener("port:cancel-intro", cancel);
      window.removeEventListener("port:motion-paused", pause);
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
