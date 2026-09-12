"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, type Transition } from "framer-motion";
import RevealOnScroll from "@/components/RevealOnScroll";
import { PROJECTS as ALL_PROJECTS, type Project } from "@/lib/projects";

// Bounding box the cursor-following preview animates within — each
// project's own video keeps its real aspect ratio (portrait, landscape,
// whatever the source is) and is "contain"-fit inside this box rather than
// all of them sharing one forced shape. See fitInBox below.
const PREVIEW_MAX_WIDTH = 340;
const PREVIEW_MAX_HEIGHT = 420;
const CURSOR_OFFSET_X = 200;
const TRANSITION: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 40,
  mass: 1,
};
const SPRING_CONFIG = { stiffness: 125, damping: 28, mass: 0.5 };

function fitInBox(width: number, height: number) {
  const scale = Math.min(PREVIEW_MAX_WIDTH / width, PREVIEW_MAX_HEIGHT / height);
  return { width: Math.round(width * scale), height: Math.round(height * scale) };
}

type ProjectsListProps = {
  // Defaults to every project (homepage usage). A project's own page
  // passes every OTHER project — see ProjectsCatalogue.
  projects?: Project[];
};

export default function ProjectsList({ projects = ALL_PROJECTS }: ProjectsListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [hovered, setHovered] = useState<number | null>(null);
  const anyActive = hovered !== null;
  const previewSizes = useMemo(
    () => projects.map((project) => fitInBox(project.coverVideo.width, project.coverVideo.height)),
    [projects],
  );
  const activeSize = previewSizes[hovered ?? 0];

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

  // Only the hovered preview actually plays — the rest sit paused so 6
  // videos aren't all decoding at once for the sake of five the cursor
  // never lands on.
  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i === hovered) video.play().catch(() => {});
      else video.pause();
    });
  }, [hovered]);

  return (
    <div
      ref={containerRef}
      onMouseMove={onMove}
      onMouseLeave={() => setHovered(null)}
      className="relative flex h-full w-full items-center justify-center overflow-hidden"
    >
      <motion.div
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
        className="pointer-events-none absolute top-0 left-0 z-10 overflow-hidden rounded-[2px]"
        animate={{
          opacity: anyActive ? 1 : 0,
          width: activeSize.width,
          height: activeSize.height,
        }}
        transition={TRANSITION}
      >
        {projects.map((project, i) => {
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
              key={project.slug}
              initial={false}
              animate={{ y: yPos }}
              transition={TRANSITION}
              className="absolute inset-0 h-full w-full overflow-hidden"
            >
              <video
                ref={(el) => {
                  videoRefs.current[i] = el;
                }}
                src={project.coverVideo.src}
                poster={project.coverImage}
                muted
                loop
                playsInline
                preload="metadata"
                disablePictureInPicture
                disableRemotePlayback
                onContextMenu={(e) => e.preventDefault()}
                className="h-full w-full object-cover"
              />
            </motion.div>
          );
        })}
      </motion.div>

      <div
        onMouseLeave={() => setHovered(null)}
        className="flex flex-col items-center gap-[2px]"
      >
        {projects.map((project, i) => {
          const isHovered = hovered === i;
          // Default: white. Active (hovered): primary. Disabled (a sibling
          // is hovered instead): white at 40% opacity.
          const colorClass = anyActive
            ? isHovered
              ? "text-primary"
              : "text-white/40"
            : "text-white";
          return (
            <RevealOnScroll key={project.slug} delay={i * 60}>
              <Link
                href={`/projects/${project.slug}`}
                onMouseEnter={() => setHovered(i)}
                className="block cursor-pointer overflow-hidden"
              >
                <motion.div
                  className="relative"
                  animate={{ y: isHovered ? "-100%" : "0%" }}
                  transition={TRANSITION}
                >
                  <span
                    className={`text-title block whitespace-pre transition-colors duration-200 ${colorClass}`}
                  >
                    {project.title}
                  </span>
                  <span
                    aria-hidden
                    className={`text-title absolute top-full left-0 block w-full whitespace-pre transition-colors duration-200 ${colorClass}`}
                  >
                    {project.title}
                  </span>
                </motion.div>
              </Link>
            </RevealOnScroll>
          );
        })}
      </div>
    </div>
  );
}
