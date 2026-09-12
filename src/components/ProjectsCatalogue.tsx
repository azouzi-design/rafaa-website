"use client";

import { useEffect, useRef, useState } from "react";
import RollingText from "@/components/RollingText";
import ProjectsList from "@/components/ProjectsList";
import { EMAIL, BOOKING_URL } from "@/lib/links";
import { PROJECTS } from "@/lib/projects";

// Figma: "projects section" (nodes 47:193, 47:207, 47:223) — the same
// ProjectsList component as the homepage, but showing every OTHER project
// (not the one currently open), plus the exact same crossing "Book a
// Call"/"Copy Email" CTA tags and scroll-gated reveal as ContactSection.
// Ported rather than shared via one abstraction: this section's CTA
// cluster also has a "minimize" affordance ContactSection's doesn't, which
// would've meant threading enough extra state through a shared component
// that duplicating the (fairly small) CTA logic was simpler. See
// ContactSection for the fuller rationale on the gesture-eating gate and
// the rotate/hover-tilt math.
const CTA_BASE =
  "group pointer-events-auto inline-block cursor-pointer whitespace-nowrap rounded-[2px] bg-primary px-3 py-2 text-black opacity-95 transition-[opacity,transform] duration-200 hover:opacity-100";
const CTA_ENTER_OFFSET = "50vh";

type CtaId = "book" | "email";

export default function ProjectsCatalogue({
  currentSlug,
}: {
  currentSlug: string;
}) {
  const otherProjects = PROJECTS.filter((p) => p.slug !== currentSlug);

  const [copied, setCopied] = useState(false);
  const [hoveredCta, setHoveredCta] = useState<CtaId | null>(null);
  const [ctasVisible, setCtasVisible] = useState(false);
  // Once the CTAs are revealed, "minimize" collapses them into a small mark
  // icon at the bottom edge; hovering that icon brings the cluster back.
  // The two are strictly exclusive — never both on screen at once — so
  // this is a plain toggle, not a temporary hover-peek.
  const [minimized, setMinimized] = useState(false);

  const rootRef = useRef<HTMLElement>(null);
  const ctasVisibleRef = useRef(false);

  const isAtRest = () => {
    const top = rootRef.current?.getBoundingClientRect().top;
    return top !== undefined && top > -4 && top < 4;
  };

  useEffect(() => {
    const revealCtas = () => {
      ctasVisibleRef.current = true;
      setCtasVisible(true);
    };

    let wheelGestureActive = false;
    let wheelQuietTimer: ReturnType<typeof setTimeout> | undefined;
    const armWheelQuietTimer = () => {
      clearTimeout(wheelQuietTimer);
      wheelQuietTimer = setTimeout(() => {
        wheelGestureActive = false;
      }, 200);
    };

    const onWheel = (e: WheelEvent) => {
      if (wheelGestureActive) {
        e.preventDefault();
        armWheelQuietTimer();
        return;
      }
      if (ctasVisibleRef.current || e.deltaY <= 0 || !isAtRest()) return;
      e.preventDefault();
      revealCtas();
      wheelGestureActive = true;
      armWheelQuietTimer();
    };

    let touchStartY = 0;
    let touchGestureActive = false;
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0]?.clientY ?? 0;
      touchGestureActive = false;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (touchGestureActive) {
        e.preventDefault();
        return;
      }
      if (ctasVisibleRef.current || !isAtRest()) return;
      const currentY = e.touches[0]?.clientY ?? touchStartY;
      if (touchStartY - currentY <= 10) return; // swipe up = scroll down
      e.preventDefault();
      revealCtas();
      touchGestureActive = true;
    };
    const onTouchEnd = () => {
      touchGestureActive = false;
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      clearTimeout(wheelQuietTimer);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  // Resets back to hidden (and un-minimized) once this section is scrolled
  // back above, so re-landing on it later replays the same sequence.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const onScroll = () => {
      const top = el.getBoundingClientRect().top;
      if (top > 4 && ctasVisibleRef.current) {
        ctasVisibleRef.current = false;
        setCtasVisible(false);
        setMinimized(false);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const ctaTransform = (id: CtaId) => {
    const rot = hoveredCta === null ? 0 : hoveredCta === id ? 4 : -4;
    const scale = hoveredCta === id ? 1.05 : 1;
    return `rotate(calc(-57.06deg + ${rot}deg)) scale(${scale})`;
  };

  // Strictly exclusive: the cluster (CTAs + minimize button) shows once
  // scrolled-to and not minimized; the icon shows only once minimized.
  const clusterVisible = ctasVisible && !minimized;
  const iconVisible = ctasVisible && minimized;

  // Scaling to 0 alongside the existing slide+fade reads as the cluster
  // shrinking away — since it also slides toward the bottom edge (where
  // the minimized icon actually sits) while doing it, minimizing looks like
  // the cluster collapses into that icon rather than just vanishing. This
  // lives on ONE shared group wrapper (see groupStyle below) rather than
  // on each button individually — scaling each around its own center would
  // shrink them toward three different points and make them drift apart
  // instead of collapsing together as one unit.
  const groupStyle = (visible: boolean) => ({
    transform: `translate(-50%, -50%) translateY(${visible ? "0px" : CTA_ENTER_OFFSET}) scale(${visible ? 1 : 0})`,
    opacity: visible ? 1 : 0,
    pointerEvents: visible ? ("auto" as const) : ("none" as const),
    transition:
      "transform 700ms cubic-bezier(0.16, 1, 0.3, 1), opacity 500ms ease-out",
  });

  const onCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API unavailable (e.g. insecure context) — nothing to
      // recover into here, the click simply has no visible effect.
    }
  };

  return (
    <section
      ref={rootRef}
      className="relative h-screen w-full snap-start snap-always bg-black"
    >
      <ProjectsList projects={otherProjects} />

      <div className="pointer-events-none absolute inset-0 z-20">
        {/* One shared wrapper, anchored at the section's center, carries
            the slide/scale/fade — the three buttons below are just fixed
            offsets *within* it, so they move and shrink together as a
            single rigid unit instead of each animating independently. */}
        <div
          className="pointer-events-none absolute top-1/2 left-1/2"
          style={groupStyle(clusterVisible)}
        >
          <div
            className="absolute"
            style={{ left: "73.5px", top: "-46.6px", transform: "translate(-50%, -50%)" }}
          >
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={CTA_BASE}
              onMouseEnter={() => setHoveredCta("book")}
              onMouseLeave={() => setHoveredCta(null)}
              style={{ transform: ctaTransform("book") }}
            >
              <RollingText text="Book a Call" className="text-title" />
            </a>
          </div>
          <div
            className="absolute"
            style={{ left: "-80.57px", top: "57.5px", transform: "translate(-50%, -50%)" }}
          >
            <button
              type="button"
              onClick={onCopyEmail}
              className={CTA_BASE}
              onMouseEnter={() => setHoveredCta("email")}
              onMouseLeave={() => setHoveredCta(null)}
              style={{ transform: ctaTransform("email") }}
            >
              <RollingText
                text={copied ? "Copied!" : "Copy Email"}
                className="text-title"
              />
            </button>
          </div>

          {/* Figma: small white "minimize" pill touching the upper tip of
              the "Book a Call" ribbon. Offset is Book a Call's own
              (73.5, -46.6) plus its position *relative to* Book a Call in
              the Figma frame (node 47:207: Book a Call wrapper center at
              (733.3, 356.4), minimize badge center at roughly (894.5,
              222)) — not a from-center offset on its own, which was the
              earlier bug. */}
          <div
            className="absolute"
            style={{ left: "235px", top: "-181px", transform: "translate(-50%, -50%)" }}
          >
            <button
              type="button"
              onClick={() => setMinimized(true)}
              className="pointer-events-auto inline-block cursor-pointer rounded-[2px] bg-white px-2 py-0.5 text-black uppercase opacity-95 transition-opacity duration-200 hover:opacity-100"
            >
              <span className="text-subtitle">minimize</span>
            </button>
          </div>
        </div>
      </div>

      {/* Figma node 47:237: the two CTAs collapse into this small slashed
          mark (bottom edge, 16px margin) — a dedicated asset, not the
          regular 13x11 logo-mark.svg used elsewhere. Hovering it swaps
          straight back to the CTA cluster (a real un-minimize, not a
          temporary peek) — the two never show at the same time. */}
      <div
        className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 transition-opacity duration-300 ease-out"
        style={{
          opacity: iconVisible ? 1 : 0,
          pointerEvents: iconVisible ? "auto" : "none",
        }}
        onMouseEnter={() => setMinimized(false)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/logo-mark-slashes.svg"
          alt=""
          aria-hidden="true"
          className="h-[32px] w-[22.43px]"
        />
      </div>
    </section>
  );
}
