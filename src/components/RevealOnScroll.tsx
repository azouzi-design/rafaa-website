"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type RevealOnScrollProps = {
  children: ReactNode;
  className?: string;
  // ms, for staggering multiple instances (e.g. one per paragraph/list item).
  delay?: number;
  // When provided, replaces self-observation — the caller drives visibility
  // instead. Needed for elements (like Footer) that are `position: fixed`
  // and therefore always geometrically "in the viewport": IntersectionObserver
  // would fire the moment they mount, not when they actually become visible
  // to the user, so those callers compute a real "is this genuinely visible
  // right now" signal themselves and pass it in here.
  active?: boolean;
  // ms, for the reveal (visible: false -> true). Defaults to the reference
  // animation's own 500ms.
  duration?: number;
  // ms, for the hide (visible: true -> false). Defaults to `duration` —
  // i.e. symmetric, same as before — but callers that toggle back and
  // forth rapidly (e.g. ProjectHero swapping between two text blocks) can
  // pass a shorter one so hiding doesn't linger.
  exitDuration?: number;
};

// Captured from 53w53.com's nav-menu reveal: each item sits in an
// overflow-hidden box with a single inner element that slides up from
// translateY(105%) (i.e. clipped fully below, out of view) to 0%, ease-out,
// 500ms. Ours also fades in (opacity 0 -> 1) alongside that slide — the
// reference's own items don't fade, just clip-reveal — since a soft fade is
// what we wanted here. Triggered by IntersectionObserver rather than a menu
// toggle, and re-plays every time the element re-enters view.
export default function RevealOnScroll({
  children,
  className = "",
  delay = 0,
  active,
  duration = 500,
  exitDuration = duration,
}: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [selfVisible, setSelfVisible] = useState(false);
  const externallyControlled = active !== undefined;

  useEffect(() => {
    if (externallyControlled) return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setSelfVisible(entry.isIntersecting),
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [externallyControlled]);

  const visible = externallyControlled ? active : selfVisible;

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <div
        className="transition-[transform,opacity] ease-out"
        style={{
          transitionDuration: `${visible ? duration : exitDuration}ms`,
          transitionDelay: `${delay}ms`,
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0%)" : "translateY(105%)",
        }}
      >
        {children}
      </div>
    </div>
  );
}
