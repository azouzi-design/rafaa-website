"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import FooterLogo from "@/components/FooterLogo";
import RollingText from "@/components/RollingText";
import RevealOnScroll from "@/components/RevealOnScroll";

const links = [
  { label: "Home", href: "#" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
  { label: "Substack", href: "#" },
  { label: "Instagram", href: "#" },
  { label: "LinkedIn", href: "#" },
];

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);

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

  // Footer is `fixed`, so it's geometrically "in the viewport" from the very
  // first frame — IntersectionObserver on itself would fire immediately,
  // long before it's actually uncovered. Contact's own bounding rect isn't
  // subject to that (it's a normal in-flow section), so its geometry is
  // what we key off of instead — see page.tsx for how Contact scrolling
  // away is what uncovers the fixed Footer beneath it.
  //
  // Same condition Navbar.tsx uses to decide when to hide itself: below
  // 50% visible AND its top has scrolled above the viewport (not just "not
  // reached yet", which also reads as ratio 0 on first load). Note this
  // can NOT be "contact fully scrolled past (bottom <= 0)" — Footer is
  // shorter than one viewport height, so even at max scroll Contact's tail
  // end still occupies the top portion of the screen and its bottom never
  // reaches 0; that condition would never fire.
  useEffect(() => {
    const contact = document.getElementById("contact");
    if (!contact) return;
    const observer = new IntersectionObserver(
      ([entry]) =>
        setRevealed(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { threshold: 0.5 },
    );
    observer.observe(contact);
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
      <nav className="flex w-full items-center justify-between text-black uppercase">
        {links.map((link, i) => (
          <a key={link.label} href={link.href} className="group block">
            <RevealOnScroll active={revealed} delay={i * 60}>
              <RollingText text={link.label} className="text-subtitle" />
            </RevealOnScroll>
          </a>
        ))}
      </nav>
      {/* Excluded from the reveal-on-first-appear treatment per instruction —
          it keeps its own hover-morph interaction only. */}
      <FooterLogo className="aspect-[410/87] w-full" />
    </footer>
  );
}
