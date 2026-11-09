"use client";

import { useEffect, useRef } from "react";
import { Icon } from "./icons";

const name = "Sebastian Noel";
const typingDelays = [
  135, 97, 124, 73, 170, 81, 103, 194, 92, 146, 205, 89, 128, 159,
];

export function NameIntro() {
  const heading = useRef<HTMLHeadingElement>(null);
  const typed = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = heading.current!;
    const text = typed.current!;
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    let timer: ReturnType<typeof setTimeout> | undefined;
    function settle() {
      clearTimeout(timer);
      text.textContent = name;
      element.dataset.introState = "complete";
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
              }
            }}
          />
        </span>
      </h1>
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
