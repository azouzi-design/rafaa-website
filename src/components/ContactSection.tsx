"use client";

import { useState } from "react";
import RollingText from "@/components/RollingText";
import RevealOnScroll from "@/components/RevealOnScroll";
import { EMAIL, BOOKING_URL } from "@/lib/links";

const TESTIMONIALS = [
  {
    quote:
      "Working with Rafaa on our EMA project was a pleasure. He was professional, reliable, and detail-oriented from start to finish, the shoot came out great, and the whole process was smooth and stress-free. Highly recommend.",
    attribution: "Rania Boukari - Regional Project Coordinator (EMA-Germany):",
  },
  {
    quote:
      "Very creative, highly independent, and incredibly quick to understand what's needed. Always a pleasure to work with ❤️",
    attribution: "Rym Ben Saida (CEO - Yall'Art Productions):",
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
const CTA_BASE =
  "group pointer-events-auto absolute cursor-pointer whitespace-nowrap rounded-[2px] bg-primary px-3 py-2 text-black opacity-95 transition-[opacity,transform] duration-200 hover:opacity-100";

type CtaId = "book" | "email";

export default function ContactSection() {
  const [copied, setCopied] = useState(false);
  const [hoveredCta, setHoveredCta] = useState<CtaId | null>(null);

  const ctaTransform = (id: CtaId) => {
    const rot = hoveredCta === null ? 0 : hoveredCta === id ? 4 : -4;
    const scale = hoveredCta === id ? 1.05 : 1;
    return `translate(-50%, -50%) rotate(calc(-57.06deg + ${rot}deg)) scale(${scale})`;
  };

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
    <div className="relative h-full w-full">
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
              <p className="text-subtitle w-[490px] max-w-full text-white">
                {t.attribution}
              </p>
            </RevealOnScroll>
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-0 z-20">
        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={CTA_BASE}
          onMouseEnter={() => setHoveredCta("book")}
          onMouseLeave={() => setHoveredCta(null)}
          style={{
            left: "calc(50% + 73.5px)",
            top: "calc(50% - 46.6px)",
            transform: ctaTransform("book"),
          }}
        >
          <RevealOnScroll delay={400}>
            <RollingText text="Book a Call" className="text-title" />
          </RevealOnScroll>
        </a>
        <button
          type="button"
          onClick={onCopyEmail}
          className={CTA_BASE}
          onMouseEnter={() => setHoveredCta("email")}
          onMouseLeave={() => setHoveredCta(null)}
          style={{
            left: "calc(50% - 80.57px)",
            top: "calc(50% + 57.5px)",
            transform: ctaTransform("email"),
          }}
        >
          <RevealOnScroll delay={500}>
            <RollingText
              text={copied ? "Copied!" : "Copy Email"}
              className="text-title"
            />
          </RevealOnScroll>
        </button>
      </div>
    </div>
  );
}
