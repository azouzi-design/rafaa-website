"use client";

import { useEffect, useRef, useState } from "react";
import RollingText from "@/components/RollingText";
import RevealOnScroll from "@/components/RevealOnScroll";
import { EMAIL, BOOKING_URL } from "@/lib/links";

const TESTIMONIALS = [
  {
    quote:
      "Working with Rafaa on our EMA project was a pleasure. He was professional, reliable, and detail-oriented from start to finish, the shoot came out great, and the whole process was smooth and stress-free. Highly recommend.",
    attribution: "Rania Boukari - Regional Project Coordinator (EMA-Germany)",
  },
  {
    quote:
      "Very creative, highly independent, and incredibly quick to understand what's needed. Always a pleasure to work with ❤️",
    attribution: "Rym Ben Saida (CEO - Yall'Art Productions)",
  },
];

// Both CTA bands are centered on the section, rotated -57.06deg, offset from
// screen-center by the same amount Figma's own rotated-bounding-box math
// produced, so they read as a loosely crossing pair of tags — close enough
// that tilting one on hover needs the other to tilt away in step, or they'd
// swing into each other. That coordination can't be pure per-element :hover
// CSS (a Tailwind hover:scale/rotate utility on either element would also
// silently lose to its own inline transform below, same as opacity would),
// so which CTA is hovered lives in state and both transforms are recomputed
// from it on every render.
//
// The hover rotate/scale transform lives on the inner button itself, while
// centering + the scroll-gated entrance slide (see below) lives on its
// absolutely-positioned wrapper — two different transforms with two
// different transition speeds can't share one `transform` property, so
// they're split across the two elements instead.
const CTA_BASE =
  "group pointer-events-auto inline-block cursor-pointer whitespace-nowrap rounded-[2px] bg-primary px-3 py-2 text-black opacity-95 transition-[opacity,transform] duration-200 hover:opacity-100";

// How far below its resting position each CTA starts, so it visibly travels
// up from the bottom of the screen rather than just fading in place.
const CTA_ENTER_OFFSET = "50vh";

type CtaId = "book" | "email";

export default function ContactSection() {
  const [copied, setCopied] = useState(false);
  const [hoveredCta, setHoveredCta] = useState<CtaId | null>(null);
  const [ctasVisible, setCtasVisible] = useState(false);
  // Once the CTAs are revealed, "minimize" collapses them into a small mark
  // icon at the bottom edge; hovering that icon brings the cluster back.
  // The two are strictly exclusive — never both on screen at once — so
  // this is a plain toggle, not a temporary hover-peek.
  const [minimized, setMinimized] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  // Mirrors state into a ref the wheel/touch/scroll listeners read
  // synchronously — they fire far more often than React re-renders, and
  // need the *current* answer immediately (esp. right after triggering the
  // reveal) rather than whatever was true as of the last render.
  const ctasVisibleRef = useRef(false);

  // "Landed on Contact" is read straight off layout (its top edge sitting
  // at the viewport's top edge, courtesy of scroll-snap) rather than from
  // an IntersectionObserver: that fires asynchronously, and a scroll that
  // jumps straight past Contact to Footer in one go (a fast mandatory-snap
  // flick, a dragged scrollbar, this exact check running mid-jump) could
  // easily land after the observer already reports Contact as gone,
  // silently disabling the gate below right when it's needed.
  const isAtContactRest = () => {
    const top = rootRef.current?.getBoundingClientRect().top;
    return top !== undefined && top > -4 && top < 4;
  };

  // The first downward scroll gesture while Contact is fully landed-on is
  // consumed *in its entirety* to play the CTAs' enter animation instead of
  // moving the page — not just its first event. A single trackpad swipe or
  // momentum scroll fires many wheel events in a burst; blocking only the
  // first one left the rest of that same burst unprevented, and with
  // mandatory scroll-snap even a small unprevented delta is enough to
  // trigger a full native snap straight past Contact to Footer, all inside
  // one physical gesture. So once revealed, wheel events keep getting
  // eaten until the wheel stream goes quiet (trackpad/mouse-wheel has no
  // real "gesture end" event, so quiet-for-a-beat is the proxy for it);
  // touch has a real boundary (touchend) so that's used directly instead.
  // Only after the gesture that triggered the reveal has fully ended does
  // the next one pass through untouched, free to carry on to Footer.
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
      if (ctasVisibleRef.current || e.deltaY <= 0 || !isAtContactRest()) {
        return;
      }
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
      if (ctasVisibleRef.current || !isAtContactRest()) return;
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

  // Resets CTAs back to hidden once Contact is scrolled back above, so
  // re-landing on it later replays the same "hidden first" sequence.
  //
  // This used to also be a safety net that force-corrected any downward
  // scroll landing past Contact with CTAs still hidden (via scrollIntoView).
  // That fought the browser's own in-flight snap animation and was the
  // source of a visible flash/jerk back to Contact. `snap-always` on
  // #contact (see page.tsx) now makes that skip impossible at the CSS
  // layer, for every input method, so the JS correction isn't needed.
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

  // Lives on ONE shared group wrapper (see below) rather than on each
  // button individually — scaling each around its own center would shrink
  // them toward two different points and make them drift apart instead of
  // collapsing together as one unit.
  const groupStyle = (visible: boolean) => ({
    transform: `translate(-50%, -50%) translateY(${visible ? "0px" : CTA_ENTER_OFFSET}) scale(${visible ? 1 : 0})`,
    opacity: visible ? 1 : 0,
    pointerEvents: visible ? ("auto" as const) : ("none" as const),
    transition: "transform 700ms cubic-bezier(0.16, 1, 0.3, 1), opacity 500ms ease-out",
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
    <div ref={rootRef} className="relative h-full w-full">
      {/* top-14 (56px) matches the fixed Navbar's actual rendered height —
          see Navbar.tsx — so the cards sit flush under it, no gap. */}
      <div className="absolute inset-x-4 top-14 bottom-4 flex flex-col gap-[6px]">
        {TESTIMONIALS.map((t, i) => (
          <div
            key={t.attribution}
            className="flex flex-1 flex-col items-center justify-center gap-5 rounded-[8px] bg-white/5 px-[60px] py-1.5 text-center"
          >
            <RevealOnScroll delay={i * 150}>
              <p className="text-big w-[860px] max-w-full text-white">
                {t.quote}
              </p>
            </RevealOnScroll>
            <RevealOnScroll delay={i * 150 + 100}>
              <p className="text-subtitle w-[490px] max-w-full text-white uppercase">
                {t.attribution}
              </p>
            </RevealOnScroll>
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-0 z-20">
        {/* One shared wrapper, anchored at the section's center, carries
            the slide/scale/fade — the two buttons below are just fixed
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
          {/* Pushed further out than Book a Call's own offset (rather than
              scaled symmetrically) — the two ribbons were crossing close
              enough to their centers to visibly overlap/touch. */}
          <div
            className="absolute"
            style={{ left: "-93px", top: "66px", transform: "translate(-50%, -50%)" }}
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
              (73.5, -46.6) plus its position *relative to* Book a Call —
              see ProjectsCatalogue for the fuller derivation. */}
          <div
            className="absolute"
            style={{ left: "235px", top: "-181px", transform: "translate(-50%, -50%)" }}
          >
            <button
              type="button"
              onClick={() => setMinimized(true)}
              className="group pointer-events-auto inline-block cursor-pointer rounded-[2px] bg-white px-2 py-0.5 text-black uppercase opacity-95 transition-opacity duration-200 hover:opacity-100"
            >
              <RollingText text="minimize" className="text-subtitle" />
            </button>
          </div>
        </div>
      </div>

      {/* Figma node 47:241: the two CTAs collapse into this compact
          readout (bottom edge, 16px margin) — labels flanking the same
          slashed mark (node 47:237, a dedicated asset, not the regular
          13x11 logo-mark.svg used elsewhere). Hovering it swaps straight
          back to the CTA cluster (a real un-minimize, not a temporary
          peek) — the two never show at the same time. Same interaction as
          ProjectsCatalogue's own minimize toggle. */}
      <div
        className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5 transition-opacity duration-300 ease-out"
        style={{
          opacity: iconVisible ? 1 : 0,
          pointerEvents: iconVisible ? "auto" : "none",
        }}
        onMouseEnter={() => setMinimized(false)}
      >
        <span className="text-subtitle text-primary uppercase">
          {copied ? "Copied!" : "Copy Email"}
        </span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/logo-mark-slashes.svg"
          alt=""
          aria-hidden="true"
          className="h-[32px] w-[22.43px]"
        />
        <span className="text-subtitle text-primary uppercase">
          Book a Call
        </span>
      </div>
    </div>
  );
}
