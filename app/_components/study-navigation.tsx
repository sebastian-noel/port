"use client";

import { useEffect, useState } from "react";

type StudySection = { id: string; label: string };

export function StudyNavigation({ sections }: { sections: StudySection[] }) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");
  const [open, setOpen] = useState(false);
  const sectionSignature = sections.map(({ id }) => id).join("|");

  useEffect(() => {
    const elements = sectionSignature
      .split("|")
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);
    const targets = elements
      .map((element) => ({
        id: element.id,
        heading:
          element instanceof HTMLHeadingElement
            ? element
            : element.querySelector("h2"),
      }))
      .filter(
        (target): target is { id: string; heading: HTMLHeadingElement } =>
          target.heading !== null,
      );
    if (!targets.length) return;

    let frame = 0;
    const updateActiveSection = () => {
      const target = targets
        .map((item) => ({
          ...item,
          top: item.heading.getBoundingClientRect().top,
        }))
        .filter(({ top }) => top <= 280)
        .sort((a, b) => b.top - a.top)[0];
      setActiveId(target?.id ?? targets[0].id);
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateActiveSection);
    };

    updateActiveSection();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [sectionSignature]);

  const activeLabel =
    sections.find(({ id }) => id === activeId)?.label ?? "Overview";

  return (
    <nav className="study-nav" aria-label="Case study sections">
      <span className="study-nav-title">On this page</span>
      <button
        className="study-nav-toggle"
        type="button"
        aria-expanded={open}
        aria-controls="study-nav-links"
        onClick={() => setOpen((value) => !value)}
      >
        <span>
          <small>On this page</small>
          <strong>{activeLabel}</strong>
        </span>
        <span className="study-nav-chevron" aria-hidden="true">
          ⌄
        </span>
      </button>
      <div className="study-nav-links" id="study-nav-links" data-open={open}>
        {sections.map(({ id, label }) => (
          <a
            key={id}
            href={`#${id}`}
            aria-current={id === activeId ? "location" : undefined}
            onClick={() => {
              setActiveId(id);
              setOpen(false);
            }}
          >
            {label}
          </a>
        ))}
      </div>
    </nav>
  );
}
