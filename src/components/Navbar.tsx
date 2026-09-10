"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, type Transition } from "framer-motion";

// Section id -> the single word the compact nav shows while it's active.
// Both services sections collapse onto the same "Services" word.
const SECTION_WORDS: Record<string, string> = {
  about: "About",
  projects: "Projects",
  "services-1": "Services",
  "services-2": "Services",
  contact: "Contact",
};

// Exact spring ProjectsList's own text hover roll uses — the word change
// here is meant to read as the same interaction, just section-driven
// instead of hover-driven.
const WORD_TRANSITION: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 40,
  mass: 1,
};

export default function Navbar() {
  const [visible, setVisible] = useState(false);
  const [activeWord, setActiveWord] = useState("About");

  // Fixed compact nav only exists once Hero has scrolled away (Hero's own
  // full link list lives in HeroNav.tsx, in-flow, not fixed — it just
  // scrolls off with the rest of Hero) and hides again past Contact, where
  // Footer (revealed sticking out from under Contact) has its own nav.
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
          if (id === "hero") {
            // Only ever HIDE here (hero entering). Never explicitly show
            // on hero exiting — that's already covered by whichever
            // content section enters right after, and if both entries
            // land in the same batch, whichever gets processed last would
            // otherwise silently override the other.
            if (entry.isIntersecting) setVisible(false);
            continue;
          }
          if (id === "contact" && !entry.isIntersecting) {
            // !isIntersecting also matches "haven't scrolled down to
            // contact yet" (e.g. right at page load) — only treat it as
            // "scrolled past contact" once its box has actually scrolled
            // up above the viewport.
            if (entry.boundingClientRect.top < 0) setVisible(false);
            continue;
          }
          if (!entry.isIntersecting) continue;
          if (SECTION_WORDS[id]) {
            setVisible(true);
            setActiveWord(SECTION_WORDS[id]);
          }
        }
      },
      { threshold: 0.5 },
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 flex items-center gap-2 p-4 text-white uppercase transition-opacity duration-300 ease-out ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/logo-mark.svg"
        alt=""
        aria-hidden="true"
        className="h-[11px] w-[13px]"
      />
      <p className="text-subtitle whitespace-nowrap">
        <span className="text-primary">{"[ "}</span>
        <span className="relative inline-block h-[16px] overflow-hidden align-bottom">
          {/* Invisible, normal-flow sizer: since the animated word below is
              absolutely positioned (so exiting/entering words can overlap
              mid-transition), it can't size this box itself — this sizes
              it to the current word's real width instead of a guessed
              fixed one, so there's no leftover gap before "]". */}
          <span className="invisible whitespace-nowrap">{activeWord}</span>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={activeWord}
              className="absolute inset-0 whitespace-nowrap"
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              exit={{ y: "-100%" }}
              transition={WORD_TRANSITION}
            >
              {activeWord}
            </motion.span>
          </AnimatePresence>
        </span>
        <span className="text-primary">{" ]"}</span>
      </p>
    </header>
  );
}
