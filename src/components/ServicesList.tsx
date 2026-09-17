"use client";

import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import RollingText from "@/components/RollingText";
import RevealOnScroll from "@/components/RevealOnScroll";

type ServicesListProps = {
  packName: string;
  description: string;
  items: string[];
  // "right": list -> stepper -> paragraph, left-to-right (Services-1).
  // "left": mirrored — paragraph -> stepper -> list (Services-2).
  side?: "left" | "right";
};

export default function ServicesList({
  packName,
  description,
  items,
  side = "right",
}: ServicesListProps) {
  const slotRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef<HTMLDivElement>(null);
  const [pointerWidth, setPointerWidth] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  // Tracks whether the pointer is currently shown, so its first appearance
  // in a section can snap straight to the hovered row instead of sliding
  // down from the top-0 default — only row-to-row moves while it's already
  // visible should animate `top`.
  const isVisibleRef = useRef(false);
  const [pointerStyle, setPointerStyle] = useState<CSSProperties>({
    opacity: 0,
    transition: "opacity 200ms ease-out",
  });

  // The pointer's own width varies with the pack name ("Creative Partner
  // Pack" vs "Production Pack"), so the gap it needs to sit in — 12px clear
  // on each side of it, between the list and the paragraph — has to be
  // measured, not assumed.
  useLayoutEffect(() => {
    if (pointerRef.current) {
      setPointerWidth(pointerRef.current.offsetWidth);
    }
  }, [packName]);

  const onRowEnter = (e: React.MouseEvent<HTMLLIElement>, i: number) => {
    setHovered(i);
    const slot = slotRef.current;
    if (!slot) return;
    const rowRect = e.currentTarget.getBoundingClientRect();
    const slotRect = slot.getBoundingClientRect();
    const appearing = !isVisibleRef.current;
    isVisibleRef.current = true;
    setPointerStyle({
      opacity: 1,
      top: rowRect.top - slotRect.top + rowRect.height / 2,
      transition: appearing
        ? "opacity 200ms ease-out"
        : "top 200ms ease-out, opacity 200ms ease-out",
    });
  };

  const onListLeave = () => {
    setHovered(null);
    isVisibleRef.current = false;
    setPointerStyle((s) => ({
      ...s,
      opacity: 0,
      transition: "opacity 200ms ease-out",
    }));
  };

  const list = (
    <ul
      onMouseLeave={onListLeave}
      className={`flex flex-col gap-1 max-[940px]:order-3 max-[940px]:w-full max-[940px]:items-start ${
        side === "right" ? "items-end" : "items-start"
      }`}
    >
      {items.map((item, i) => (
        <li
          key={item}
          onMouseEnter={(e) => onRowEnter(e, i)}
          className="group cursor-default whitespace-nowrap max-[940px]:whitespace-normal"
        >
          <RevealOnScroll delay={i * 60}>
            <RollingText
              text={item}
              className={`text-big transition-colors duration-200 ${
                hovered === i ? "text-primary" : "text-white"
              }`}
            />
          </RevealOnScroll>
        </li>
      ))}
    </ul>
  );

  // Below 940px the hover-driven pointer (see `stepper` below) has no touch
  // equivalent, so the pack name + mark are shown here instead as a static,
  // always-visible title leading the stacked mobile layout.
  const mobileTitle = (
    <RevealOnScroll className="hidden max-[940px]:order-1 max-[940px]:block">
      <div className="flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/logo-mark.svg"
          alt=""
          aria-hidden="true"
          className="h-[11px] w-[13px]"
        />
        <span className="text-subtitle text-primary uppercase">
          {packName}
        </span>
      </div>
    </RevealOnScroll>
  );

  // Slot is sized to the pointer's own measured width, stretched to the
  // list's full height (its tallest sibling) so the pointer's `top` —
  // measured relative to this slot — lines up with whichever row is
  // hovered. Combined with the row's gap-[12px] on each side, this reserves
  // exactly pointerWidth + 24px between the list and the paragraph, so the
  // (always-rendered, opacity-toggled) pointer never collides with either.
  const stepper = (
    <div
      ref={slotRef}
      className="relative shrink-0 self-stretch max-[940px]:hidden"
      style={{ width: pointerWidth || undefined }}
    >
      <div
        ref={pointerRef}
        className={`pointer-events-none absolute top-0 flex w-max -translate-y-1/2 items-center gap-3 whitespace-nowrap ${
          side === "right" ? "left-0" : "right-0"
        }`}
        style={pointerStyle}
      >
        {side === "right" ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo-mark.svg"
              alt=""
              aria-hidden="true"
              className="h-[11px] w-[13px]"
            />
            <span className="text-subtitle text-primary uppercase">
              {packName}
            </span>
          </>
        ) : (
          <>
            <span className="text-subtitle text-primary uppercase">
              {packName}
            </span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo-mark.svg"
              alt=""
              aria-hidden="true"
              className="h-[11px] w-[13px]"
            />
          </>
        )}
      </div>
    </div>
  );

  const paragraph = (
    <RevealOnScroll className="w-[300px] shrink-0 max-[940px]:order-2 max-[940px]:w-full max-[940px]:max-w-[300px]">
      <p
        className={`text-paragraph text-white max-[940px]:text-left ${
          side === "right" ? "text-left" : "text-right"
        }`}
      >
        {description}
      </p>
    </RevealOnScroll>
  );

  return (
    <div className="flex h-full w-full items-center justify-center gap-[12px] max-[940px]:flex-col max-[940px]:items-start max-[940px]:justify-center max-[940px]:gap-6 max-[940px]:px-4 max-[940px]:py-24">
      {mobileTitle}
      {side === "right" ? (
        <>
          {list}
          {stepper}
          {paragraph}
        </>
      ) : (
        <>
          {paragraph}
          {stepper}
          {list}
        </>
      )}
    </div>
  );
}
