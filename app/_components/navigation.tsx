"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { Icon } from "./icons";
import { site } from "../_lib/site";

const pages = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/experiences", label: "Experiences" },
  { href: "/about", label: "About" },
];

export function Navigation() {
  const pathname = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  function closeMenu() {
    dialog.current?.close();
  }

  function pageLinks() {
    return pages.map(({ href, label }) => (
      <Link
        key={href}
        href={href}
        aria-current={
          pathname === href || (href !== "/" && pathname.startsWith(`${href}/`))
            ? "page"
            : undefined
        }
        onClick={closeMenu}
      >
        {label}
      </Link>
    ));
  }

  return (
    <header className="site-header">
      <div className="nav-row">
        <Link className="wordmark" href="/" aria-label="Sebastian Noel, home">
          snoel<span>.dev</span>
        </Link>
        <nav className="desktop-nav" aria-label="Main">
          {pageLinks()}
        </nav>
        <div className="nav-actions">
          <a
            className="resume-link"
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Resume (PDF, opens in a new tab)"
          >
            <Icon name="file" />
            <span>Resume</span>
            <Icon name="external" />
          </a>
          {site.profiles.slice(0, 2).map((profile) => (
            <a
              className="social-link icon-button"
              key={profile.label}
              href={profile.href}
              aria-label={profile.label}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon name={profile.label === "GitHub" ? "github" : "linkedin"} />
            </a>
          ))}
          <button
            className="menu-trigger"
            ref={trigger}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-haspopup="dialog"
            onClick={() => {
              dialog.current?.showModal();
              setOpen(true);
            }}
          >
            <Icon name="menu" />
            <span className="sr-only">Menu</span>
          </button>
        </div>
      </div>
      <dialog
        id="mobile-menu"
        ref={dialog}
        aria-labelledby="menu-title"
        onKeyDown={(event) => {
          if (event.key !== "Tab") return;
          const controls =
            event.currentTarget.querySelectorAll<HTMLElement>(
              "button, a[href]",
            );
          const first = controls[0];
          const last = controls[controls.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last?.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first?.focus();
          }
        }}
        onClose={() => {
          setOpen(false);
          trigger.current?.focus();
        }}
      >
        <div className="menu-top">
          <h2 id="menu-title">Explore</h2>
          <button onClick={closeMenu} autoFocus>
            Close <Icon name="close" />
          </button>
        </div>
        <nav aria-label="Mobile">
          {pageLinks()}
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Resume (PDF, opens in a new tab)"
            onClick={closeMenu}
          >
            Resume <Icon name="external" />
          </a>
        </nav>
        <div className="menu-socials">
          {site.profiles.map((profile) => (
            <a key={profile.label} href={profile.href} onClick={closeMenu}>
              {profile.label} <Icon name="external" />
            </a>
          ))}
        </div>
      </dialog>
    </header>
  );
}
