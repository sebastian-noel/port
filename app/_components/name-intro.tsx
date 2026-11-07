"use client";

import { useEffect, useRef } from "react";
import { Icon } from "./icons";

const name = "Sebastian Noel";

export function NameIntro() {
  const heading = useRef<HTMLHeadingElement>(null);
  const typed = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = heading.current!;
    const text = typed.current!;
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    let seen = false;
    try {
      seen = sessionStorage.getItem("port:intro-seen") === "1";
      sessionStorage.setItem("port:intro-seen", "1");
    } catch {
      // Private browsing can disable session storage.
    }
    let timer: ReturnType<typeof setInterval> | undefined;
    function settle() {
      clearInterval(timer);
      text.textContent = name;
      element.dataset.introState = "complete";
    }
    if (seen || media.matches) settle();
    else {
      let index = 0;
      text.textContent = "";
      element.dataset.introState = "typing";
      timer = setInterval(() => {
        text.textContent = name.slice(0, ++index);
        if (index === name.length) {
          settle();
          const rect = element.getBoundingClientRect();
          window.dispatchEvent(new CustomEvent("port:intro-complete", {
            detail: { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 },
          }));
        }
      }, 85);
    }
    function motionChange() { if (media.matches) settle(); }
    media.addEventListener("change", motionChange);
    return () => {
      clearInterval(timer);
      media.removeEventListener("change", motionChange);
      window.dispatchEvent(new Event("port:cancel-intro"));
    };
  }, []);

  return (
    <section className="splash">
      <h1 ref={heading} className="intro-name" data-intro-state="complete">
        <span className="sr-only">{name}</span>
        <span className="name-reserve" aria-hidden="true">{name}</span>
        <span className="name-typed" aria-hidden="true"><span ref={typed}>{name}</span><span className="caret" /></span>
      </h1>
      <a className="splash-down icon-button" href="#workspace" aria-label="Explore the site"><Icon name="down" /></a>
    </section>
  );
}
