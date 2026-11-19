"use client";

import Image from "next/image";
import { useRef } from "react";

type Photo = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption: string;
  hero?: boolean;
};

export function StudyPhoto({
  src,
  alt,
  width,
  height,
  caption,
  hero = false,
}: Photo) {
  const dialog = useRef<HTMLDialogElement>(null);
  return (
    <figure className={hero ? "study-hero" : "study-image"}>
      <button
        className={hero ? "study-photo-trigger cover" : "study-photo-trigger"}
        type="button"
        aria-label={`Expand image: ${alt}`}
        onClick={() => dialog.current?.showModal()}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes="(max-width: 900px) 100vw, 1100px"
        />
      </button>
      <figcaption>{caption}</figcaption>
      <dialog
        ref={dialog}
        className="photo-dialog"
        aria-label="Expanded project image"
        onClick={(event) => {
          if (event.target === event.currentTarget) event.currentTarget.close();
        }}
      >
        <button
          className="photo-close"
          type="button"
          aria-label="Close image"
          onClick={() => dialog.current?.close()}
        >
          ×
        </button>
        <figure onClick={(event) => event.stopPropagation()}>
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            sizes="100vw"
            loading="eager"
          />
          <figcaption>{caption}</figcaption>
        </figure>
      </dialog>
    </figure>
  );
}
