"use client";

import { useEffect, useRef, useState } from "react";
import { motion, type Transition } from "framer-motion";
import RevealOnScroll from "@/components/RevealOnScroll";
import type { Project } from "@/lib/projects";

const TRANSITION: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 32,
  mass: 1,
};

// Figma: "Hero-part1" (node 46:124) is the resting state — title+
// description anchored near the left edge, small cover video bottom-right.
// Scrolling down (or clicking the video) morphs it into "hero-part2" (node
// 47:142): the video grows into a large top-right hero shot and the text
// column drops to bottom-left with its description shrunk to paragraph
// size and reordered above the title.
//
// The video is one continuous element whose box genuinely grows/moves, so
// a framer-motion `layout` spring suits it. The text is NOT animated that
// way: reflowing one element through a reorder + a font-size change via
// layout's scale-trick looked janky. Instead each phase's text lives at its
// own fixed spot the whole time, and only ever fades/slides via this site's
// standard RevealOnScroll (same component AboutSection uses) — Part1's
// copy reveals out while Part2's reveals in, and vice versa on the way
// back, rather than one block trying to morph into the other.
//
// The state is bidirectional and gates the page's own scroll the same way
// ContactSection's CTA reveal does: while the hero is still "at rest" (its
// own top edge at the viewport top), a downward wheel/touch gesture is
// consumed entirely to flip part1 -> part2 instead of moving the page, and
// an upward one flips part2 -> part1. Only once part2 is already showing
// does a further downward gesture pass through untouched — combined with
// this section's own `snap-start` (see globals.css's global mandatory
// scroll-snap-type, same mechanism the homepage sections use), that single
// un-gated gesture is what carries the page on to the next section in one
// motion, exactly like scrolling between homepage sections.
export default function ProjectHero({ project }: { project: Project }) {
  const rootRef = useRef<HTMLElement>(null);
  const [entered, setEntered] = useState(false);
  // Wheel/touch listeners fire far more often than React re-renders and
  // need the *current* answer immediately (esp. right after a gesture just
  // flipped it), so state is mirrored into a ref they read synchronously —
  // same reasoning as ContactSection's ctasVisibleRef.
  const enteredRef = useRef(false);
  // Part1's RevealOnScroll is driven by `active={!entered}`, which is
  // already true on the very first render (entered starts false) — a CSS
  // transition only plays on a value *change*, so without this it was born
  // already visible and the on-load reveal never had anything to animate
  // from. Flipping this true one tick after mount (self-observing
  // RevealOnScroll instances elsewhere get this same one-tick gap for free
  // from their IntersectionObserver callback) gives it a real false->true
  // transition to play.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const setPhase = (next: boolean) => {
    enteredRef.current = next;
    setEntered(next);
  };

  // Read straight off layout (not an IntersectionObserver) so it's correct
  // synchronously inside the same wheel/touch event that might act on it —
  // see ContactSection's isAtContactRest for the fuller rationale.
  const isAtRest = () => {
    const top = rootRef.current?.getBoundingClientRect().top;
    return top !== undefined && top > -4 && top < 4;
  };

  // Once part2 is showing, leaving the hero shouldn't be a slow native
  // scroll through the full h-screen distance (proportional to however
  // much the user happens to scroll) — a single qualifying gesture instead
  // snaps straight to the next section in one quick, fixed-duration glide,
  // same spirit as the part1<->part2 flip being instant rather than
  // distance-dependent. Driven manually (rather than
  // `scrollIntoView({behavior:"smooth"})`) because native smooth-scroll
  // duration isn't controllable and runs noticeably slower than this.
  const advanceToNext = () => {
    const target = rootRef.current?.nextElementSibling;
    if (!target) return;
    const startY = window.scrollY;
    const endY = startY + target.getBoundingClientRect().top;
    const duration = 260;
    const startTime = performance.now();
    const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

    const step = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1);
      window.scrollTo(0, startY + (endY - startY) * easeOutCubic(t));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  useEffect(() => {
    // A single physical swipe fires many wheel events in a burst; once one
    // of them triggers a phase flip, the rest of that same burst is eaten
    // too so it can't also leak into a native scroll past the hero (or, on
    // the way back, past part1) in the same motion. Wheel/touch have no
    // real "gesture end" event, so quiet-for-a-beat / touchend stand in for
    // one — identical technique to ContactSection's own gate.
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
      if (!isAtRest()) return;
      if (e.deltaY > 0 && !enteredRef.current) {
        e.preventDefault();
        setPhase(true);
        wheelGestureActive = true;
        armWheelQuietTimer();
      } else if (e.deltaY < 0 && enteredRef.current) {
        e.preventDefault();
        setPhase(false);
        wheelGestureActive = true;
        armWheelQuietTimer();
      } else if (e.deltaY > 0 && enteredRef.current) {
        e.preventDefault();
        advanceToNext();
        wheelGestureActive = true;
        armWheelQuietTimer();
      }
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
      if (!isAtRest()) return;
      const currentY = e.touches[0]?.clientY ?? touchStartY;
      const delta = touchStartY - currentY; // positive = swiping up = scrolling down
      if (Math.abs(delta) <= 10) return;
      if (delta > 0 && !enteredRef.current) {
        e.preventDefault();
        setPhase(true);
        touchGestureActive = true;
      } else if (delta < 0 && enteredRef.current) {
        e.preventDefault();
        setPhase(false);
        touchGestureActive = true;
      } else if (delta > 0 && enteredRef.current) {
        e.preventDefault();
        advanceToNext();
        touchGestureActive = true;
      }
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

  const { width, height } = project.coverVideo;

  return (
    <section
      ref={rootRef}
      className="relative h-screen w-full snap-start overflow-hidden bg-black"
    >
      <motion.div
        layout
        transition={TRANSITION}
        onClick={() => setPhase(true)}
        style={{ aspectRatio: `${width} / ${height}` }}
        className={
          entered
            ? "absolute top-4 right-4 w-full max-w-[68vw] overflow-hidden rounded-[2px]"
            : "absolute right-4 bottom-4 h-[110px] w-auto cursor-pointer overflow-hidden rounded-[2px] opacity-97"
        }
      >
        <video
          src={project.coverVideo.src}
          poster={project.coverImage}
          autoPlay
          muted
          loop
          playsInline
          disablePictureInPicture
          disableRemotePlayback
          onContextMenu={(e) => e.preventDefault()}
          className="h-full w-full object-cover"
        />
      </motion.div>

      {/* Part1 copy: fixed in place at 20% from the left, vertically
          centered. Only its visibility (via RevealOnScroll) responds to
          phase — its position never moves. */}
      <div
        aria-hidden={entered}
        className="absolute top-1/2 left-[20%] flex w-[680px] max-w-[calc(80%-16px)] -translate-y-1/2 flex-col items-start gap-4"
      >
        <RevealOnScroll active={mounted && !entered} exitDuration={200}>
          <h1 className="text-title w-full text-white">{project.title}</h1>
        </RevealOnScroll>
        <RevealOnScroll
          active={mounted && !entered}
          delay={100}
          exitDuration={200}
        >
          <p className="text-big w-full text-white">{project.description}</p>
        </RevealOnScroll>
      </div>

      {/* Part2 copy: fixed bottom-left, description above title. Same
          fade/slide reveal, just the other block. */}
      <div
        aria-hidden={!entered}
        className="absolute bottom-4 left-4 flex w-[380px] max-w-[calc(100%-32px)] flex-col items-start gap-3"
      >
        <RevealOnScroll active={entered} exitDuration={200}>
          <p className="text-paragraph w-full text-white">{project.description}</p>
        </RevealOnScroll>
        <RevealOnScroll active={entered} delay={100} exitDuration={200}>
          <h1 className="text-title w-full text-white">{project.title}</h1>
        </RevealOnScroll>
      </div>
    </section>
  );
}
