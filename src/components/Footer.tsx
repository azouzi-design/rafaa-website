"use client";

import { useLayoutEffect, useRef } from "react";
import FooterLogo from "@/components/FooterLogo";
import RollingText from "@/components/RollingText";
import { SOCIAL_LINKS } from "@/lib/links";

// Home-relative ("/#section") rather than bare "#section" hashes — Footer
// is now also rendered on project pages, and a bare hash there would try to
// scroll to an anchor on the current (project) page instead of navigating
// back to the matching homepage section.
const links = [
  { label: "Home", href: "/#hero" },
  { label: "About", href: "/#about" },
  { label: "Projects", href: "/#projects" },
  { label: "Services", href: "/#services-1" },
  { label: "Contact", href: "/#contact" },
  { label: "Substack", href: SOCIAL_LINKS.substack, external: true },
  { label: "Instagram", href: SOCIAL_LINKS.instagram, external: true },
  { label: "LinkedIn", href: SOCIAL_LINKS.linkedin, external: true },
];

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  // Publish the footer's own (fluid, aspect-ratio driven) height as a CSS
  // var so page.tsx can reserve exactly that much trailing scroll room —
  // see the comment there for why.
  useLayoutEffect(() => {
    const el = footerRef.current;
    if (!el) return;

    const setHeightVar = () => {
      document.documentElement.style.setProperty(
        "--footer-h",
        `${el.offsetHeight}px`,
      );
    };
    setHeightVar();

    const observer = new ResizeObserver(setHeightVar);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Pinned to the viewport bottom from the very start, permanently behind
  // <main>'s z-10 (see page.tsx) — NOT a negative z-index: with only the
  // plain <body> as its containing block, a negative z-index is a classic
  // hit-testing trap (unclickable everywhere, even where visible) — see
  // page.tsx for the full explanation. z-0 vs main's z-10 is an
  // unambiguous, purely positive comparison instead.
  return (
    <footer
      ref={footerRef}
      id="footer"
      className="fixed inset-x-0 bottom-0 z-0 flex w-full flex-col gap-20 bg-primary p-4"
    >
      {/* No reveal-on-first-appear gating here (unlike the rest of the
          site) — Footer is `fixed`, so its links are always technically
          on screen; gating them behind scroll-derived state meant any
          remount (e.g. a dev Fast Refresh full reload) could reset that
          state to "hidden" with nothing left to re-trigger it. Always
          rendering avoids that whole class of bug. */}
      <nav className="flex w-full items-center justify-between text-black uppercase">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target={link.external ? "_blank" : undefined}
            rel={link.external ? "noopener noreferrer" : undefined}
            className="group block"
          >
            <RollingText text={link.label} className="text-subtitle" />
          </a>
        ))}
      </nav>
      {/* Also excluded from the reveal-on-first-appear treatment — it keeps
          its own hover-morph interaction only. */}
      <FooterLogo className="aspect-[410/87] w-full" />
    </footer>
  );
}
