"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "./icons";

const name = "Sebastian Noel";
const typingDelays = [
  135, 97, 124, 73, 170, 81, 103, 194, 92, 146, 205, 89, 128, 159,
];

export function NameIntro() {
  const heading = useRef<HTMLHeadingElement>(null);
  const typed = useRef<HTMLSpanElement>(null);
  const [hint, setHint] = useState(false);

  useEffect(() => {
    const element = heading.current!;
    const text = typed.current!;
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    let timer: ReturnType<typeof setTimeout> | undefined;
    let hintTimer: ReturnType<typeof setTimeout> | undefined;
    let introDone = false;
    let waveDone = false;
    let scrolled = window.scrollY > 0;
    function scheduleHint() {
      if (introDone && waveDone && !scrolled) {
        clearTimeout(hintTimer);
        hintTimer = setTimeout(() => setHint(true), 1000);
      }
    }
    function finishIntro() {
      introDone = true;
      scheduleHint();
    }
    function finishWave() {
      waveDone = true;
      scheduleHint();
    }
    function onScroll() {
      if (window.scrollY > 0) {
        scrolled = true;
        clearTimeout(hintTimer);
        setHint(false);
      }
    }
    window.addEventListener("port:wave-complete", finishWave);
    window.addEventListener("port:caret-complete", finishIntro);
    window.addEventListener("scroll", onScroll, { passive: true });
    function settle() {
      clearTimeout(timer);
      text.textContent = name;
      element.dataset.introState = "complete";
      waveDone = true;
      finishIntro();
    }
    if (media.matches) settle();
    else {
      let index = 0;
      text.textContent = "";
      element.dataset.introState = "typing";
      function typeNext() {
        text.textContent = name.slice(0, ++index);
        if (index < name.length) {
          timer = setTimeout(typeNext, typingDelays[index]);
          return;
        }
        element.dataset.introState = "finishing";
        const rect = element.getBoundingClientRect();
        window.dispatchEvent(
          new CustomEvent("port:intro-complete", {
            detail: {
              x: rect.left + rect.width / 2,
              y: rect.top + rect.height / 2,
            },
          }),
        );
      }
      timer = setTimeout(typeNext, typingDelays[0]);
    }
    function motionChange() {
      if (media.matches) settle();
    }
    media.addEventListener("change", motionChange);
    return () => {
      clearTimeout(timer);
      clearTimeout(hintTimer);
      window.removeEventListener("port:wave-complete", finishWave);
      window.removeEventListener("port:caret-complete", finishIntro);
      window.removeEventListener("scroll", onScroll);
      media.removeEventListener("change", motionChange);
      window.dispatchEvent(new Event("port:cancel-intro"));
    };
  }, []);

  return (
    <section className="splash">
      <h1 ref={heading} className="intro-name" data-intro-state="complete">
        <span className="sr-only">{name}</span>
        <span className="name-reserve" aria-hidden="true">
          {name}
        </span>
        <span className="name-typed" aria-hidden="true">
          <span ref={typed}>{name}</span>
          <span
            className="caret"
            onAnimationEnd={(event) => {
              if (event.animationName === "caret-fade" && heading.current) {
                heading.current.dataset.introState = "complete";
                window.dispatchEvent(new Event("port:caret-complete"));
              }
            }}
          />
        </span>
      </h1>
      <span
        className={`scroll-hint${hint ? " is-visible" : ""}`}
        aria-hidden="true"
      >
        Scroll down...
      </span>
      <a
        className="splash-down icon-button"
        href="#workspace"
        aria-label="Explore the site"
      >
        <Icon name="down" />
      </a>
    </section>
  );
}
