"use client";

import { useRef, useState } from "react";
import RevealOnScroll from "@/components/RevealOnScroll";

const ABOUT_IMAGES = [
  "/images/about/about-01.webp",
  "/images/about/about-02.webp",
  "/images/about/about-03.webp",
  "/images/about/about-04.webp",
  "/images/about/about-05.webp",
  "/images/about/about-06.webp",
  "/images/about/about-07.webp",
  "/images/about/about-08.webp",
  "/images/about/about-09.webp",
  "/images/about/about-10.webp",
  "/images/about/about-11.webp",
  "/images/about/about-12.webp",
  "/images/about/about-13.webp",
  "/images/about/about-14.webp",
];

// How far (px) the cursor has to travel since the last spawn before the next
// photo pops in — small enough to feel responsive, large enough that photos
// don't crowd on top of each other.
const SPAWN_DISTANCE = 90;
const BOX_W = 170;
const BOX_H = 210;
// Total lifetime of one photo: fade/scale in, hold, fade/scale out. The
// removal timeout mirrors this so the DOM node is cleared right as it
// finishes disappearing.
const TRAIL_LIFETIME_MS = 1500;
// Hard cap on concurrent photos so a burst of fast mouse movement can't pile
// up more DOM nodes than intended while waiting for their timeouts to fire.
const MAX_CONCURRENT = 7;

type TrailItem = {
  id: number;
  src: string;
  x: number;
  y: number;
  rotate: number;
  scale: number;
};

export default function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [trail, setTrail] = useState<TrailItem[]>([]);
  const lastSpawnRef = useRef<{ x: number; y: number } | null>(null);
  const lastImageRef = useRef<string | null>(null);
  const idRef = useRef(0);
  const timeoutsRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const last = lastSpawnRef.current;
    if (last) {
      const dx = x - last.x;
      const dy = y - last.y;
      if (dx * dx + dy * dy < SPAWN_DISTANCE * SPAWN_DISTANCE) return;
    }
    lastSpawnRef.current = { x, y };

    // Avoid the same photo appearing twice in a row.
    let src = ABOUT_IMAGES[Math.floor(Math.random() * ABOUT_IMAGES.length)];
    if (ABOUT_IMAGES.length > 1) {
      while (src === lastImageRef.current) {
        src = ABOUT_IMAGES[Math.floor(Math.random() * ABOUT_IMAGES.length)];
      }
    }
    lastImageRef.current = src;

    const id = idRef.current++;
    const item: TrailItem = {
      id,
      src,
      x,
      y,
      rotate: Math.random() * 12 - 6,
      scale: 0.9 + Math.random() * 0.25,
    };

    setTrail((prev) => {
      const next = [...prev, item];
      return next.length > MAX_CONCURRENT ? next.slice(1) : next;
    });

    const timeoutId = setTimeout(() => {
      timeoutsRef.current.delete(timeoutId);
      setTrail((prev) => prev.filter((i) => i.id !== id));
    }, TRAIL_LIFETIME_MS);
    timeoutsRef.current.add(timeoutId);
  };

  const clearTrail = () => {
    for (const id of timeoutsRef.current) clearTimeout(id);
    timeoutsRef.current.clear();
    lastSpawnRef.current = null;
    setTrail([]);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={clearTrail}
      className="relative h-full w-full overflow-hidden bg-black"
    >
      <style>{`
        @keyframes about-trail-pop {
          0% { opacity: 0; transform: rotate(var(--trail-rotate)) scale(calc(var(--trail-scale) * 0.7)); }
          15% { opacity: 1; transform: rotate(var(--trail-rotate)) scale(var(--trail-scale)); }
          75% { opacity: 1; transform: rotate(var(--trail-rotate)) scale(var(--trail-scale)); }
          100% { opacity: 0; transform: rotate(var(--trail-rotate)) scale(calc(var(--trail-scale) * 0.94)); }
        }
        @keyframes about-carousel-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .about-carousel-track {
          width: max-content;
          animation: about-carousel-scroll 26s linear infinite;
        }
      `}</style>

      <div className="absolute inset-0 z-0 flex items-center justify-center px-[20px] max-[940px]:pb-[170px]">
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

      {/* Mobile has no cursor to drive the hover trail above, so it gets a
          continuously auto-scrolling carousel of the same photos instead,
          docked 20px off the bottom edge. The image list is duplicated so
          translateX(-50%) always lands exactly one set later, looping
          seamlessly regardless of item count or width. */}
      <div className="hidden max-[940px]:absolute max-[940px]:inset-x-0 max-[940px]:bottom-[20px] max-[940px]:z-10 max-[940px]:block max-[940px]:overflow-hidden">
        <div className="about-carousel-track flex gap-1.5 px-4">
          {[...ABOUT_IMAGES, ...ABOUT_IMAGES].map((src, i) => (
            <div
              key={`${src}-${i}`}
              className="h-[136px] w-[110px] shrink-0 overflow-hidden rounded-[2px] shadow-[0_10px_25px_rgba(0,0,0,0.45)]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 z-10 max-[940px]:hidden">
        {trail.map((item) => (
          <div
            key={item.id}
            style={{
              position: "absolute",
              left: item.x,
              top: item.y,
              width: BOX_W,
              height: BOX_H,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                "--trail-rotate": `${item.rotate}deg`,
                "--trail-scale": item.scale,
                animation: `about-trail-pop ${TRAIL_LIFETIME_MS}ms ease-out forwards`,
              } as React.CSSProperties}
              className="overflow-hidden rounded-[2px] shadow-[0_20px_45px_rgba(0,0,0,0.45)]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.src}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
