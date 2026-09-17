"use client";

import { useEffect, useState, type RefObject } from "react";

// Whether `containerRef`'s direct children would still fit on a single row
// at `gapPx` apart — independent of whatever flex-wrap state the container
// is currently rendered in, since a flex item's own width comes from its
// content, not from how many lines the container happens to be split into.
// Callers use this to switch between an "evenly distributed" layout (e.g.
// justify-between) while everything fits, and a wrapped, top-left-aligned
// one once it no longer does — a distinction plain CSS can't express in one
// rule once more than one item ends up sharing a wrapped line.
export function useFitsOneLine(
  containerRef: RefObject<HTMLElement | null>,
  gapPx: number,
) {
  const [fits, setFits] = useState(true);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => {
      const children = Array.from(el.children) as HTMLElement[];
      if (children.length === 0) return;
      const contentWidth =
        children.reduce((sum, child) => sum + child.offsetWidth, 0) +
        gapPx * (children.length - 1);
      setFits(contentWidth <= el.clientWidth);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    // Local font swap can shift text metrics after the initial measurement.
    document.fonts?.ready.then(measure);

    return () => observer.disconnect();
  }, [containerRef, gapPx]);

  return fits;
}
