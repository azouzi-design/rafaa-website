"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import RevealOnScroll from "@/components/RevealOnScroll";

// Image order matches the Figma track exactly; each box is 432px tall (1.2x
// the old 360px marquee sizing) with width left to the image's own natural
// aspect ratio.
const IMAGE_TRACK = [
  "/images/about/about-02.jpg",
  "/images/about/about-05.jpg",
  "/images/about/about-01.jpg",
  "/images/about/about-04.jpg",
  "/images/about/about-03.jpg",
];

// How much accumulated wheel/touch delta (px) it takes to sweep the gallery
// fully across the screen — tuned by feel, not tied to any real document
// scroll distance (the section stays exactly one viewport tall; see below).
const SWEEP_DISTANCE = 4200;

// Per-frame lerp factor pulling the rendered position toward the input-driven
// target — gives the sweep a damped, eased-follow feel instead of tracking
// the wheel 1:1.
const SMOOTHING = 0.15;

// Unlike a ScrollTrigger pin, this never grows the document's scroll height:
// the About section stays exactly one viewport tall and the outer page never
// scrolls past it while the gallery is mid-sweep. Instead, wheel/touch input
// is captured and converted into a virtual 0-1 progress value that drives the
// image track directly via a manual rAF lerp (not gsap.quickTo — mixing that
// with gsap.set for the immediate/resize case desyncs its internal tween
// cache and the track settles at the wrong position). Input only falls
// through to the real (snap-scrolling) page once the sweep has fully
// finished in that direction — at progress 0 scrolling up, or progress 1
// scrolling down.
export default function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const targetProgress = useRef(0);
  const renderedProgress = useRef(0);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const xFor = (progress: number) => {
      const startX = container.offsetWidth; // fully off-screen right
      const endX = -track.scrollWidth; // fully off-screen left
      return gsap.utils.interpolate(startX, endX, progress);
    };

    const render = () => {
      renderedProgress.current +=
        (targetProgress.current - renderedProgress.current) * SMOOTHING;
      track.style.transform = `translateX(${xFor(renderedProgress.current)}px)`;
    };

    render();
    let rafId = requestAnimationFrame(function loop() {
      render();
      rafId = requestAnimationFrame(loop);
    });

    const snapImmediate = () => {
      renderedProgress.current = targetProgress.current;
      render();
    };

    const resizeObserver = new ResizeObserver(snapImmediate);
    resizeObserver.observe(track);
    window.addEventListener("resize", snapImmediate);

    const nudge = (delta: number, distance: number) => {
      const atStart = targetProgress.current <= 0;
      const atEnd = targetProgress.current >= 1;
      if ((atStart && delta < 0) || (atEnd && delta > 0)) return false;
      targetProgress.current = gsap.utils.clamp(
        0,
        1,
        targetProgress.current + delta / distance,
      );
      return true;
    };

    const handleWheel = (e: WheelEvent) => {
      if (nudge(e.deltaY, SWEEP_DISTANCE)) e.preventDefault();
    };

    let touchY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      const y = e.touches[0].clientY;
      const delta = touchY - y;
      touchY = y;
      if (nudge(delta, SWEEP_DISTANCE * 0.6)) e.preventDefault();
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    container.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      window.removeEventListener("resize", snapImmediate);
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden bg-black"
    >
      <div className="absolute inset-0 z-0 flex items-center justify-center px-[20px]">
        <div className="flex max-w-[800px] flex-col gap-8 text-center">
          <RevealOnScroll>
            <p className="text-big text-white">
              I&apos;ve been making content since I was a kid, photography,
              design, video. Marketing came later, but it made sense
              immediately: it&apos;s science and art on the same plate, and I
              wanted both.
            </p>
          </RevealOnScroll>
          <RevealOnScroll delay={150}>
            <p className="text-big text-white">
              Years of sales, strategy, and content taught me one thing, no
              matter how complex the problem, people trust what they can see,
              hear, and feel. That&apos;s why I built SIMPLE. Video-first
              stories that make complexity easy to trust.
            </p>
          </RevealOnScroll>
        </div>
      </div>

      <div className="absolute inset-0 z-10 flex items-center overflow-hidden">
        <div ref={trackRef} className="flex w-max items-center gap-[6px]">
          {IMAGE_TRACK.map((src, i) => (
            <div
              key={i}
              className="h-[432px] shrink-0 overflow-hidden rounded-[2px] opacity-[0.97]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                className="pointer-events-none h-full w-auto object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
