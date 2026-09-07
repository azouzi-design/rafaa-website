type LogoProps = {
  className?: string;
};

// The source SVG (public/images/logo.svg) has hardcoded black fills, so it's
// applied as a CSS mask here rather than an <img> — that lets it render white
// on this dark hero while staying a single source file.
export default function Logo({ className }: LogoProps) {
  return (
    <div
      role="img"
      aria-label="SIMPLE by Rafaa Chawali"
      className={`bg-white ${className ?? ""}`}
      style={{
        maskImage: "url(/images/logo.svg)",
        maskRepeat: "no-repeat",
        maskSize: "contain",
        maskPosition: "left center",
        WebkitMaskImage: "url(/images/logo.svg)",
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskSize: "contain",
        WebkitMaskPosition: "left center",
        filter: "drop-shadow(var(--shadow-soft))",
      }}
    />
  );
}
