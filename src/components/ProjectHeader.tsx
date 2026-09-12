import Link from "next/link";

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
        className="flex w-fit items-center gap-2 text-white uppercase"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/logo-mark.svg"
          alt=""
          aria-hidden="true"
          className="h-[11px] w-[13px]"
        />
        <span className="text-subtitle whitespace-nowrap">
          <span className="text-primary">{"[ "}</span>
          Return Home
          <span className="text-primary">{" ]"}</span>
        </span>
      </Link>
    </header>
  );
}
