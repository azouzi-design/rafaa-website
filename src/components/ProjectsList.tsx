"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, type Transition } from "framer-motion";
import RevealOnScroll from "@/components/RevealOnScroll";

type Project = {
  text: string;
  image: string;
};

// Placeholder thumbnails reusing the About section's photos — swap for real
// project stills once available.
const PROJECTS: Project[] = [
  { text: "Fabskill", image: "/images/about/about-01.jpg" },
  { text: "Cynoia", image: "/images/about/about-02.jpg" },
  { text: "Jam Music Academy", image: "/images/about/about-03.jpg" },
  { text: 'Radhi Chawali — "Hide & Seek"', image: "/images/about/about-04.jpg" },
  { text: "Spectra La Rose", image: "/images/about/about-05.jpg" },
  { text: "Oakley x Cactus Jack", image: "/images/about/about-01.jpg" },
];

const IMAGE_WIDTH = 300;
const IMAGE_HEIGHT = 400;
const CURSOR_OFFSET_X = 200;
const TRANSITION: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 40,
  mass: 1,
};
const SPRING_CONFIG = { stiffness: 125, damping: 28, mass: 0.5 };

export default function ProjectsList() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const anyActive = hovered !== null;

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, SPRING_CONFIG);
  const y = useSpring(rawY, SPRING_CONFIG);

  const onMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    rawX.set(e.clientX - rect.left + CURSOR_OFFSET_X);
    rawY.set(e.clientY - rect.top);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={onMove}
      onMouseLeave={() => setHovered(null)}
      className="relative flex h-full w-full items-center justify-center overflow-hidden"
    >
      <motion.div
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
        className="pointer-events-none absolute top-0 left-0 z-10 overflow-hidden rounded-2xl"
        animate={{
          opacity: anyActive ? 1 : 0,
          width: IMAGE_WIDTH,
          height: IMAGE_HEIGHT,
        }}
        transition={TRANSITION}
      >
        {PROJECTS.map((project, i) => {
          const yPos =
            hovered === null
              ? "100%"
              : i < hovered
                ? "-100%"
                : i > hovered
                  ? "100%"
                  : "0%";
          return (
            <motion.div
              key={project.text}
              initial={false}
              animate={{ y: yPos }}
              transition={TRANSITION}
              className="absolute inset-0 h-full w-full overflow-hidden"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.image}
                alt={project.text}
                className="h-full w-full object-cover"
              />
            </motion.div>
          );
        })}
      </motion.div>

      <div className="flex flex-col items-center gap-[2px]">
        {PROJECTS.map((project, i) => {
          const isHovered = hovered === i;
          // Default: white. Active (hovered): primary. Disabled (a sibling
          // is hovered instead): white at 40% opacity.
          const colorClass = anyActive
            ? isHovered
              ? "text-primary"
              : "text-white/40"
            : "text-white";
          return (
            <RevealOnScroll key={project.text} delay={i * 60}>
              <div
                onMouseEnter={() => setHovered(i)}
                className="cursor-default overflow-hidden"
              >
                <motion.div
                  className="relative"
                  animate={{ y: isHovered ? "-100%" : "0%" }}
                  transition={TRANSITION}
                >
                  <span
                    className={`text-title block whitespace-pre transition-colors duration-200 ${colorClass}`}
                  >
                    {project.text}
                  </span>
                  <span
                    aria-hidden
                    className={`text-title absolute top-full left-0 block w-full whitespace-pre transition-colors duration-200 ${colorClass}`}
                  >
                    {project.text}
                  </span>
                </motion.div>
              </div>
            </RevealOnScroll>
          );
        })}
      </div>
    </div>
  );
}
