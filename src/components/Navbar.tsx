"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import RollingText from "@/components/RollingText";
import RevealOnScroll from "@/components/RevealOnScroll";

const primaryLinks = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Services", href: "#services-1" },
  { label: "Contact", href: "#contact" },
];

const secondaryLinks = [
  { label: "Substack", href: "#" },
  { label: "Instagram", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "Copy Email", href: "#" },
];

// Section id -> the single word the compact nav shows while it's active.
// Both services sections collapse onto the same "Services" word.
const SECTION_WORDS: Record<string, string> = {
  about: "About",
  projects: "Projects",
  "services-1": "Services",
  "services-2": "Services",
  contact: "Contact",
};

type Phase = "hero" | "nav" | "hidden";

export default function Navbar() {
  const [phase, setPhase] = useState<Phase>("hero");
  const [activeWord, setActiveWord] = useState("About");

  const rootRef = useRef<HTMLElement>(null);
  const fullNavRef = useRef<HTMLDivElement>(null);
  const compactNavRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);

  // Track which section is in view: Hero -> full link list, any content
  // section -> compact mark + word, past Contact -> hide (Footer, which is
  // revealed sticking out from under Contact, has its own nav).
  //
  // Footer itself is deliberately NOT observed here: it's revealed via a
  // sticky-under-Contact effect (see page.tsx/Footer.tsx), so its layout
  // box overlaps the viewport the entire time Contact is on screen even
  // though it's visually hidden behind Contact — IntersectionObserver only
  // sees geometry, not paint order, so it can't tell those two states
  // apart. Contact's own geometry is unaffected by that trick, so we use
  // Contact leaving the viewport (not Footer entering it) as the "hide"
  // signal — symmetric in both scroll directions.
  useEffect(() => {
    const ids = ["hero", ...Object.keys(SECTION_WORDS)];
    const targets = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id;
          if (id === "contact" && !entry.isIntersecting) {
            // !isIntersecting also matches "haven't scrolled down to
            // contact yet" (e.g. right at page load) — only treat it as
            // "scrolled past contact" once its box has actually scrolled
            // up above the viewport.
            if (entry.boundingClientRect.top < 0) setPhase("hidden");
            continue;
          }
          if (!entry.isIntersecting) continue;
          if (id === "hero") setPhase("hero");
          else if (SECTION_WORDS[id]) {
            setPhase("nav");
            setActiveWord(SECTION_WORDS[id]);
          }
        }
      },
      { threshold: 0.5 },
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Crossfade the full hero nav in/out against the compact scrolled nav,
  // and hide the whole bar while the footer (which has its own nav) is up.
  // Plain gsap.to() (not gsap.context().revert()) so a phase flip mid-scroll
  // just retargets the running tween via its default overwrite behavior
  // instead of snapping back to a stale "reverted" value.
  useEffect(() => {
    const showFull = phase === "hero";
    const showCompact = phase === "nav";

    gsap.to(fullNavRef.current, {
      opacity: showFull ? 1 : 0,
      duration: 0.4,
      ease: "power2.out",
    });
    gsap.to(compactNavRef.current, {
      opacity: showCompact ? 1 : 0,
      y: showCompact ? 0 : -6,
      duration: 0.4,
      ease: "power2.out",
    });
    gsap.to(rootRef.current, {
      autoAlpha: phase === "hidden" ? 0 : 1,
      duration: 0.3,
      ease: "power1.out",
    });
  }, [phase]);

  // Crossfade the single word whenever the active section changes.
  const isFirstWordRender = useRef(true);
  useEffect(() => {
    if (isFirstWordRender.current) {
      isFirstWordRender.current = false;
      return;
    }
    gsap.fromTo(
      wordRef.current,
      { opacity: 0, y: 4 },
      { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" },
    );
  }, [activeWord]);

  // Kill any in-flight tweens on unmount only.
  useEffect(() => {
    const targets = [
      fullNavRef.current,
      compactNavRef.current,
      rootRef.current,
      wordRef.current,
    ];
    return () => {
      gsap.killTweensOf(targets);
    };
  }, []);

  return (
    <header
      ref={rootRef}
      className="fixed inset-x-0 top-0 z-50 text-white uppercase"
    >
      {/* Hero state: full primary + secondary link list. */}
      <div
        ref={fullNavRef}
        className={`mix-blend-difference flex items-center justify-between p-4 ${
          phase === "hero" ? "" : "pointer-events-none"
        }`}
      >
        <ul className="flex items-center gap-6">
          {primaryLinks.map((link, i) => (
            <li key={link.label}>
              <a href={link.href} className="group block">
                <RevealOnScroll active={phase === "hero"} delay={i * 60}>
                  <RollingText text={link.label} className="text-subtitle" />
                </RevealOnScroll>
              </a>
            </li>
          ))}
        </ul>
        <ul className="flex items-center gap-6">
          {secondaryLinks.map((link, i) => (
            <li key={link.label}>
              <a href={link.href} className="group block">
                <RevealOnScroll
                  active={phase === "hero"}
                  delay={(primaryLinks.length + i) * 60}
                >
                  <RollingText text={link.label} className="text-subtitle" />
                </RevealOnScroll>
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Scrolled state: compact mark + the current section's word. */}
      <div
        ref={compactNavRef}
        className={`absolute inset-0 flex items-center gap-2 p-4 opacity-0 ${
          phase === "nav" ? "" : "pointer-events-none"
        }`}
      >
        <img
          src="/images/logo-mark.svg"
          alt=""
          aria-hidden="true"
          className="h-[11px] w-[13px]"
        />
        <p className="text-subtitle whitespace-nowrap">
          <span className="text-primary">{"[ "}</span>
          <span ref={wordRef}>{activeWord}</span>
          <span className="text-primary">{" ]"}</span>
        </p>
      </div>
    </header>
  );
}
