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
  const [pointerStyle, setPointerStyle] = useState<CSSProperties>({
    opacity: 0,
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
    setPointerStyle({
      opacity: 1,
      top: rowRect.top - slotRect.top + rowRect.height / 2,
    });
  };

  const onListLeave = () => {
    setHovered(null);
    setPointerStyle((s) => ({ ...s, opacity: 0 }));
  };

  const list = (
    <ul
      onMouseLeave={onListLeave}
      className={`flex flex-col gap-1 ${
        side === "right" ? "items-end" : "items-start"
      }`}
    >
      {items.map((item, i) => (
        <li
          key={item}
          onMouseEnter={(e) => onRowEnter(e, i)}
          className="group cursor-default whitespace-nowrap"
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

  // Slot is sized to the pointer's own measured width, stretched to the
  // list's full height (its tallest sibling) so the pointer's `top` —
  // measured relative to this slot — lines up with whichever row is
  // hovered. Combined with the row's gap-[12px] on each side, this reserves
  // exactly pointerWidth + 24px between the list and the paragraph, so the
  // (always-rendered, opacity-toggled) pointer never collides with either.
  const stepper = (
    <div
      ref={slotRef}
      className="relative shrink-0 self-stretch"
      style={{ width: pointerWidth || undefined }}
    >
      <div
        ref={pointerRef}
        className={`pointer-events-none absolute top-0 flex w-max -translate-y-1/2 items-center gap-3 whitespace-nowrap transition-[top,opacity] duration-200 ease-out ${
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
    <RevealOnScroll className="w-[300px] shrink-0">
      <p
        className={`text-paragraph text-white ${
          side === "right" ? "text-left" : "text-right"
        }`}
      >
        {description}
      </p>
    </RevealOnScroll>
  );

  return (
    <div className="flex h-full w-full items-center justify-center gap-[12px]">
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
