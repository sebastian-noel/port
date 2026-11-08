"use client";

import { useEffect, useRef, type CSSProperties } from "react";

// Digits choose the shade. A plus marks a loose pixel at a cluster's edge.
const clusters: {
  name: string;
  x: number;
  y: number;
  rows: string[];
  wide?: boolean;
}[] = [
  {
    name: "northwest",
    x: 12,
    y: 23,
    rows: ["...112.", "..12231", ".123221", "112221.", "1221+..", "11.+..."],
  },
  {
    name: "north",
    x: 39,
    y: 28,
    rows: ["..111", ".1221", "1232.", "122+."],
    wide: true,
  },
  {
    name: "northeast",
    x: 84,
    y: 18,
    rows: [
      "11211...",
      "122321..",
      ".122321.",
      ".1222321",
      "..122211",
      "...1+...",
      "....+...",
    ],
  },
  {
    name: "west",
    x: 7,
    y: 58,
    rows: [".11..", "1231.", "12221", ".122.", "..+.."],
  },
  {
    name: "east",
    x: 93,
    y: 62,
    rows: ["..111..", ".12211.", "1233221", "112221.", ".12++.."],
  },
  {
    name: "southwest",
    x: 23,
    y: 77,
    rows: ["..111..", ".1221..", "122321.", "1232211", ".12221.", "..1++.."],
  },
  {
    name: "south",
    x: 48,
    y: 72,
    rows: [".11..", "1221.", "1122.", ".1+.."],
    wide: true,
  },
  {
    name: "southeast",
    x: 76,
    y: 82,
    rows: ["...111.", "..12321", ".123221", "122221.", "1121+..", ".1.+..."],
  },
];

const tileShades = ["#76a0eb", "#89afef", "#a4c4f6"];
const rippleShades = ["#b6ceef", "#dbe2e8", "#f2f4f5", "#8cb1ec", "#527fc8"];

export function TileField() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = root.current!;
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const animations = new Set<Animation>();
    let paused = false;
    let scrollFrame = 0;

    function motionAllowed() {
      return !paused && !media.matches && !document.hidden;
    }
    function cancelWave() {
      animations.forEach((animation) => animation.cancel());
      animations.clear();
      element.dataset.wave = "idle";
    }
    function stopMotion() {
      cancelAnimationFrame(scrollFrame);
      scrollFrame = 0;
      cancelWave();
    }
    function onScroll() {
      if (scrollFrame || !motionAllowed()) return;
      scrollFrame = requestAnimationFrame(() => {
        scrollFrame = 0;
        const distance = Math.max(0, window.scrollY);
        // Ease into a bounded drift so long pages keep their clusters in view.
        element.style.setProperty(
          "--tile-scroll",
          String(distance / (distance + 640)),
        );
      });
    }
    function flip(face: HTMLElement, delay: number) {
      const animation = face.animate(
        [
          { transform: "rotateY(0deg)" },
          { transform: "rotateY(180deg)", offset: 0.5 },
          { transform: "rotateY(360deg)" },
        ],
        { duration: 810, delay, easing: "cubic-bezier(.25,.55,.4,1)" },
      );
      animations.add(animation);
      animation.onfinish = () => {
        animations.delete(animation);
        animation.cancel();
        if (!animations.size) element.dataset.wave = "idle";
      };
    }
    function wave(event: Event) {
      if (!motionAllowed()) return;
      cancelWave();
      const { x, y } = (event as CustomEvent<{ x: number; y: number }>).detail;
      const visible = Array.from(
        element.querySelectorAll<HTMLElement>(".tile-face"),
      ).flatMap((face) => {
        const rect = face.getBoundingClientRect();
        if (!rect.width) return [];
        const distance = Math.hypot(
          rect.left + rect.width / 2 - x,
          rect.top + rect.height / 2 - y,
        );
        return [{ face, delay: Math.min(distance / 2.2, 540) }];
      });
      if (!visible.length) return;
      element.dataset.wave = "active";
      visible.forEach(({ face, delay }) => flip(face, delay));
    }
    function syncMotion() {
      if (motionAllowed()) onScroll();
      else stopMotion();
    }
    function pause(event: Event) {
      paused = (event as CustomEvent<boolean>).detail;
      syncMotion();
    }
    syncMotion();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("port:intro-complete", wave);
    window.addEventListener("port:cancel-intro", cancelWave);
    window.addEventListener("port:motion-paused", pause);
    document.addEventListener("visibilitychange", syncMotion);
    media.addEventListener("change", syncMotion);
    return () => {
      stopMotion();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("port:intro-complete", wave);
      window.removeEventListener("port:cancel-intro", cancelWave);
      window.removeEventListener("port:motion-paused", pause);
      document.removeEventListener("visibilitychange", syncMotion);
      media.removeEventListener("change", syncMotion);
    };
  }, []);
  return (
    <div
      ref={root}
      className="tile-field"
      aria-hidden="true"
      data-wave="idle"
    >
      {clusters.map(({ name, x, y, rows, wide }, clusterIndex) => (
        <div
          key={name}
          className={wide ? "tile-cluster tile-cluster-wide" : "tile-cluster"}
          style={
            {
              "--cluster-x": `${x}%`,
              "--cluster-y": `${y}%`,
            } as CSSProperties
          }
        >
          {rows.map((line, row) =>
            Array.from(line, (cell, column) => {
              if (cell === ".") return null;
              const loose = cell === "+";
              const style = {
                gridColumn: column + 1,
                gridRow: row + 1,
                "--tile-rest": tileShades[loose ? 1 : Number(cell) - 1],
                "--tile-back":
                  rippleShades[
                    (row + column * 2 + clusterIndex) % rippleShades.length
                  ],
                "--tile-fall-x": loose ? (x < 50 ? "-9px" : "9px") : undefined,
                "--tile-fall-y": loose
                  ? `${36 + ((row + column) % 3) * 12}px`
                  : undefined,
              } as CSSProperties;
              return (
                <span
                  key={`${row}-${column}`}
                  className={loose ? "tile tile-drift" : "tile"}
                  style={style}
                >
                  <span className="tile-face" />
                </span>
              );
            }),
          )}
        </div>
      ))}
    </div>
  );
}
