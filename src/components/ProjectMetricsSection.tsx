"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import RevealOnScroll from "@/components/RevealOnScroll";
import type { ProjectMetric } from "@/lib/projects";

// How long the box itself takes to trace up before its text starts —
// the text's own RevealOnScroll delay (below) is offset by this so it
// never starts until the box it lives in has finished appearing.
const BOX_DURATION = 0.55;
const BOX_DURATION_MS = BOX_DURATION * 1000;

// Same stagger shape as Hero's own text reveal (page.tsx: value/label ~150ms
// apart) and AboutSection's paragraph-to-paragraph gap (150ms) — each card's
// own box-then-text sequence starts 150ms after the previous card's.
function MetricCard({
  metric,
  index,
  className,
}: {
  metric: ProjectMetric;
  index: number;
  className?: string;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const cardDelay = index * 150;

  // The box "traces" in from its own bottom edge (scaleY from a bottom
  // transform-origin) rather than just fading — replays every time the
  // card re-enters view, same as RevealOnScroll's own repeatable reveal,
  // so scrolling back up and back down plays it again.
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    gsap.set(el, { transformOrigin: "center bottom", scaleY: 0 });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          gsap.to(el, {
            scaleY: 1,
            duration: BOX_DURATION,
            delay: cardDelay / 1000,
            ease: "power3.out",
            overwrite: true,
          });
        } else {
          gsap.to(el, {
            scaleY: 0,
            duration: 0.25,
            ease: "power2.in",
            overwrite: true,
          });
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [cardDelay]);

  const textDelay = cardDelay + BOX_DURATION_MS;

  return (
    <div
      ref={boxRef}
      className={`flex flex-col items-center justify-center gap-3 rounded-[2px] bg-primary px-5 py-3 text-center text-black ${className ?? ""}`}
    >
      <RevealOnScroll delay={textDelay}>
        <p className="text-title">{metric.value}</p>
      </RevealOnScroll>
      <RevealOnScroll delay={textDelay + 100}>
        <p className="text-subtitle uppercase">{metric.label}</p>
      </RevealOnScroll>
    </div>
  );
}

// Figma (nodes 55:182/190/194/207/215): a full-viewport-height section
// right after a project's first video, showing 1-3 metric cards. Desktop
// lays them out so every card touches its neighbors' corners exactly —
// a 2x2 (1 or 2 metrics) or 3x2 (3 metrics) grid with only the relevant
// cells filled reproduces that with zero gap, no manual offset math. Each
// card's height comes from `aspect-[…]` (its own Figma w/h ratio) rather
// than a fixed px height, so the whole grid scales with the fluid
// (inset-4-bounded) width instead of getting a fixed 480px-tall block on
// every screen size.
//
// Below 620px that corner-touching composition doesn't degrade gracefully
// by just shrinking (cards and text would go illegibly small) — same call
// as ProjectsList's separate mobile carousel — so mobile gets a plain
// bottom-anchored stack instead (16px bottom margin, 6px between cards —
// same idea as ContactSection's testimonial cards).
export default function ProjectMetricsSection({
  metrics,
}: {
  metrics?: ProjectMetric[];
}) {
  if (!metrics?.length) return null;

  return (
    <section className="relative h-screen w-full snap-start bg-black">
      <div className="absolute inset-x-4 bottom-4 hidden flex-col gap-[6px] max-[620px]:flex">
        {metrics.map((metric, i) => (
          <MetricCard key={i} metric={metric} index={i} />
        ))}
      </div>

      {metrics.length === 1 && (
        <div className="hidden min-[621px]:absolute min-[621px]:inset-4 min-[621px]:grid min-[621px]:grid-cols-2 min-[621px]:grid-rows-2">
          <MetricCard
            metric={metrics[0]}
            index={0}
            className="col-start-2 row-start-2 h-full w-full"
          />
        </div>
      )}

      {metrics.length === 2 && (
        <div className="hidden min-[621px]:absolute min-[621px]:top-1/2 min-[621px]:inset-x-4 min-[621px]:grid min-[621px]:-translate-y-1/2 min-[621px]:grid-cols-2 min-[621px]:grid-rows-2">
          <MetricCard
            metric={metrics[0]}
            index={0}
            className="col-start-1 row-start-2 aspect-[684/240] w-full"
          />
          <MetricCard
            metric={metrics[1]}
            index={1}
            className="col-start-2 row-start-1 aspect-[684/240] w-full"
          />
        </div>
      )}

      {metrics.length === 3 && (
        <div className="hidden min-[621px]:absolute min-[621px]:top-1/2 min-[621px]:inset-x-4 min-[621px]:grid min-[621px]:-translate-y-1/2 min-[621px]:grid-cols-3 min-[621px]:grid-rows-2">
          <MetricCard
            metric={metrics[0]}
            index={0}
            className="col-start-1 row-start-1 aspect-[456/240] w-full"
          />
          <MetricCard
            metric={metrics[1]}
            index={1}
            className="col-start-3 row-start-1 aspect-[456/240] w-full"
          />
          <MetricCard
            metric={metrics[2]}
            index={2}
            className="col-start-2 row-start-2 aspect-[456/240] w-full"
          />
        </div>
      )}
    </section>
  );
}
