"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./experiences.module.css";

type TimelineItem = { slug: string; title: string; date: string };

export function ExperienceTimeline({
  items,
  children,
}: {
  items: TimelineItem[];
  children: ReactNode;
}) {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(items[0]?.slug ?? "");
  const [allOpen, setAllOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const container = root.current;
    if (!container) return;
    const cards = Array.from(
      container.querySelectorAll<HTMLElement>("article"),
    );
    const details = Array.from(
      container.querySelectorAll<HTMLDetailsElement>("details"),
    );
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const animations = new Set<Animation>();
    let frame = 0;

    function updatePosition() {
      frame = 0;
      let index = 0;
      cards.forEach((card, position) => {
        if (card.getBoundingClientRect().top <= innerHeight * 0.4)
          index = position;
      });
      setActive(cards[index]?.id ?? "");
      container?.style.setProperty(
        "--timeline-progress",
        `${index / Math.max(1, cards.length - 1)}`,
      );
    }
    function schedulePosition() {
      if (!frame) frame = requestAnimationFrame(updatePosition);
    }
    function syncDetails() {
      setAllOpen(details.length > 0 && details.every((detail) => detail.open));
      schedulePosition();
    }
    function finishAnimations() {
      animations.forEach((animation) => animation.finish());
      animations.clear();
    }
    const reveal = new IntersectionObserver(
      (entries) => {
        entries.forEach(({ target, isIntersecting }) => {
          if (!isIntersecting) return;
          reveal.unobserve(target);
          if (preference.matches || target.contains(document.activeElement))
            return;
          const card = target.querySelector("[data-experience-card]");
          if (!card) return;
          const animation = card.animate(
            [
              { opacity: 0, transform: "translateY(28px)" },
              { opacity: 1, transform: "translateY(0)" },
            ],
            { duration: 650, easing: "cubic-bezier(.22,1,.36,1)" },
          );
          animations.add(animation);
          animation.onfinish = () => animations.delete(animation);
        });
      },
      { threshold: 0.08 },
    );
    const resize = new ResizeObserver(schedulePosition);
    cards.forEach((card) => {
      reveal.observe(card);
      resize.observe(card);
    });
    details.forEach((detail) => detail.addEventListener("toggle", syncDetails));
    container.addEventListener("focusin", finishAnimations);
    preference.addEventListener("change", finishAnimations);
    window.addEventListener("scroll", schedulePosition, { passive: true });
    window.addEventListener("resize", schedulePosition);
    updatePosition();
    setReady(true);

    return () => {
      reveal.disconnect();
      resize.disconnect();
      finishAnimations();
      cancelAnimationFrame(frame);
      details.forEach((detail) =>
        detail.removeEventListener("toggle", syncDetails),
      );
      container.removeEventListener("focusin", finishAnimations);
      preference.removeEventListener("change", finishAnimations);
      window.removeEventListener("scroll", schedulePosition);
      window.removeEventListener("resize", schedulePosition);
    };
  }, []);

  function jumpTo(slug: string) {
    const target = document.getElementById(slug);
    if (!target) return;
    history.pushState(null, "", `#${slug}`);
    target.scrollIntoView({
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
      block: "start",
    });
    target.querySelector<HTMLElement>("h2")?.focus({ preventScroll: true });
    setActive(slug);
  }

  return (
    <div className={styles.experiences} ref={root}>
      <div className={styles.toolbar}>
        <span>{items.length} experiences</span>
        <button
          className={styles.expandAll}
          type="button"
          hidden={!ready}
          aria-expanded={allOpen}
          aria-controls="experience-cards"
          onClick={() => {
            root.current?.querySelectorAll("details").forEach((detail) => {
              detail.open = !allOpen;
            });
            setAllOpen(!allOpen);
          }}
        >
          <span aria-hidden="true">{allOpen ? "−" : "+"}</span>
          {allOpen ? "Hide all details" : "Show all details"}
        </button>
      </div>
      <div className={styles.layout}>
        <nav className={styles.timelineNav} aria-label="Experience timeline">
          <div className={styles.mobileJump}>
            <label htmlFor="experience-jump">Jump to</label>
            <div className={styles.selectWrap}>
              <select
                id="experience-jump"
                value={active}
                onChange={(event) => jumpTo(event.target.value)}
              >
                {items.map((item) => (
                  <option key={item.slug} value={item.slug}>
                    {item.title} · {item.date}
                  </option>
                ))}
              </select>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
          </div>
          <div className={styles.desktopTimeline}>
            <p className={styles.timelineLabel}>Timeline</p>
            <ol>
              {items.map((item) => (
                <li key={item.slug}>
                  <a
                    href={`#${item.slug}`}
                    aria-current={active === item.slug ? "step" : undefined}
                    onClick={(event) => {
                      if (
                        event.metaKey ||
                        event.ctrlKey ||
                        event.shiftKey ||
                        event.altKey
                      )
                        return;
                      event.preventDefault();
                      jumpTo(item.slug);
                    }}
                  >
                    <span className={styles.timelineDot} aria-hidden="true" />
                    <span>
                      <span className={styles.timelineDate}>{item.date}</span>
                      <span className={styles.timelineCompany}>
                        {item.title}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </nav>
        <div className={styles.cards} id="experience-cards">
          {children}
        </div>
      </div>
    </div>
  );
}
