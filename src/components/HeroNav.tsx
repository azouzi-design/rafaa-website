"use client";

import { useState } from "react";
import RollingText from "@/components/RollingText";
import RevealOnScroll from "@/components/RevealOnScroll";
import { EMAIL, SOCIAL_LINKS } from "@/lib/links";

const primaryLinks = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Services", href: "#services-1" },
  { label: "Contact", href: "#contact" },
];

const secondaryLinks = [
  { label: "Substack", href: SOCIAL_LINKS.substack },
  { label: "Instagram", href: SOCIAL_LINKS.instagram },
  { label: "LinkedIn", href: SOCIAL_LINKS.linkedin },
];

// Hero's reveal-on-view plays as soon as the page loads (Hero is visible
// from frame one) — held back a beat so it doesn't fire instantly on load.
const HERO_DELAY = 1100;

// Lives inside Hero (not fixed) — it scrolls away with Hero's own content
// like any other in-flow element. Once it's gone, Navbar's fixed compact
// mark + word takes over for the rest of the page.
export default function HeroNav() {
  const [copied, setCopied] = useState(false);

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
    <div className="absolute inset-x-0 top-0 z-10 mix-blend-difference flex items-center justify-between p-4 text-white uppercase">
      <ul className="flex items-center gap-6">
        {primaryLinks.map((link, i) => (
          <li key={link.label}>
            <a href={link.href} className="group block">
              <RevealOnScroll delay={HERO_DELAY + i * 60}>
                <RollingText text={link.label} className="text-subtitle" />
              </RevealOnScroll>
            </a>
          </li>
        ))}
      </ul>
      <ul className="flex items-center gap-6">
        {secondaryLinks.map((link, i) => (
          <li key={link.label}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <RevealOnScroll delay={HERO_DELAY + (primaryLinks.length + i) * 60}>
                <RollingText text={link.label} className="text-subtitle" />
              </RevealOnScroll>
            </a>
          </li>
        ))}
        <li>
          <button
            type="button"
            onClick={onCopyEmail}
            className="group block cursor-pointer uppercase"
          >
            <RevealOnScroll
              delay={HERO_DELAY + (primaryLinks.length + secondaryLinks.length) * 60}
            >
              <RollingText
                text={copied ? "Copied!" : "Copy Email"}
                className="text-subtitle"
              />
            </RevealOnScroll>
          </button>
        </li>
      </ul>
    </div>
  );
}
