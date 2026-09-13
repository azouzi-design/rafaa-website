import Link from "next/link";
import RollingText from "@/components/RollingText";

// Always-visible equivalent of Navbar for project detail pages: those pages
// have none of the homepage's scroll-tracked section ids, so Navbar's own
// IntersectionObserver would just never fire and leave it permanently
// hidden. Static + always on avoids depending on that machinery at all.
// Fixed for the whole page (not just the hero) per the Figma spec.
export default function ProjectHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 p-4">
      <Link
        href="/"
        className="group flex w-fit items-center gap-2 text-white uppercase"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/logo-mark.svg"
          alt=""
          aria-hidden="true"
          className="h-[11px] w-[13px]"
        />
        {/* Explicit gap rather than a literal space inside "[ "/" ]" — once
            this row became flex (needed so RollingText's own block-level
            root doesn't force a line break), a trailing/leading space
            character inside a flex item isn't a reliable way to size a
            gap. */}
        <span className="text-subtitle flex items-baseline gap-1 whitespace-nowrap">
          <span className="text-primary">[</span>
          <RollingText text="Return Home" className="text-subtitle" />
          <span className="text-primary">]</span>
        </span>
      </Link>
    </header>
  );
}
