"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
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
          sn<span aria-hidden="true">.</span>
        </Link>
        <nav className="desktop-nav" aria-label="Main">
          {pageLinks()}
        </nav>
        <div className="nav-actions">
          <Link className="resume-link" href="/resume">
            Resume <span aria-hidden="true">↗</span>
          </Link>
          {site.profiles.slice(0, 2).map((profile) => (
            <a className="social-link" key={profile.label} href={profile.href}>
              {profile.label}
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
            <span aria-hidden="true">☰</span> Menu
          </button>
        </div>
      </div>
      <dialog
        id="mobile-menu"
        ref={dialog}
        aria-labelledby="menu-title"
        onKeyDown={(event) => {
          if (event.key !== "Tab") return;
          const controls = event.currentTarget.querySelectorAll<HTMLElement>(
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
            Close <span aria-hidden="true">×</span>
          </button>
        </div>
        <nav aria-label="Mobile">
          {pageLinks()}
          <Link href="/resume" onClick={closeMenu}>
            Resume
          </Link>
        </nav>
        <div className="menu-socials">
          {site.profiles.map((profile) => (
            <a key={profile.label} href={profile.href} onClick={closeMenu}>
              {profile.label} ↗
            </a>
          ))}
        </div>
      </dialog>
    </header>
  );
}
