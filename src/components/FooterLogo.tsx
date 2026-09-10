"use client";

import { useRef } from "react";
import gsap from "gsap";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";

if (typeof window !== "undefined") {
  gsap.registerPlugin(MorphSVGPlugin);
}

// Exact path data from public/images/logo.svg (S / I / M / P / L / E).
const LETTER_PATHS = [
  "M37.677 87C26.7562 87 18.0194 84.5703 11.4669 79.7108C4.9144 74.773 1.09209 67.8365 0 58.9014H17.3174C17.8634 63.4473 20.0476 67.0527 23.8699 69.7176C27.6922 72.3041 32.5676 73.5973 38.4961 73.5973C43.3325 73.5973 47.0378 72.7351 49.612 71.0108C52.2642 69.2865 53.5903 66.9743 53.5903 64.0743C53.5903 61.3311 52.8102 59.1365 51.2501 57.4905C49.69 55.7662 46.9988 54.3946 43.1765 53.3757L27.4972 49.0257C19.4626 46.7527 13.5731 43.6568 9.82879 39.7378C6.1625 35.7405 4.32935 30.7635 4.32935 24.8068C4.32935 19.7122 5.61645 15.323 8.19066 11.6392C10.8429 7.87703 14.5482 5.01621 19.3066 3.05675C24.0649 1.01892 29.6424 0 36.0389 0C45.8677 0 53.7073 2.35135 59.5578 7.05405C65.4083 11.6784 68.7235 17.8311 69.5036 25.5122H52.1862C51.4061 21.3581 49.495 18.3014 46.4527 16.3419C43.4885 14.3824 39.6662 13.4027 34.9858 13.4027C30.9295 13.4027 27.6922 14.1865 25.274 15.7541C22.8558 17.3216 21.6467 19.4378 21.6467 22.1027C21.6467 24.1405 22.3098 26.0216 23.6359 27.7459C24.962 29.3919 27.7312 30.8027 31.9436 31.9784L47.6228 36.3284C55.8915 38.6014 61.82 41.7365 65.4082 45.7338C69.0745 49.6527 70.9077 54.6297 70.9077 60.6649C70.9077 69.1297 67.9825 75.6351 62.132 80.1811C56.2815 84.727 48.1299 87 37.677 87Z",
  "M70.1289 85.9419L88.7711 1.29324H106.791L88.1483 85.9419H70.1289Z",
  "M102.061 85.9419L111.071 1.29324H133.771L154.482 85.2365H144.77L165.364 1.29324H188.18L197.307 85.9419H179.522L171.097 3.9973H177.65L158.577 85.9419H139.972L121.134 4.7027H127.452L119.145 85.9419H102.061Z",
  "M204.33 85.9419V1.29324H244.348C250.588 1.29324 255.932 2.39054 260.378 4.58513C264.902 6.77973 268.374 9.83648 270.792 13.7554C273.288 17.6743 274.536 22.2595 274.536 27.5108C274.536 32.7622 273.288 37.3865 270.792 41.3838C268.296 45.3811 264.785 48.5162 260.261 50.7892C255.815 52.9838 250.51 54.0811 244.348 54.0811H218.606V40.2081H243.412C247.546 40.2081 250.744 39.0716 253.006 36.7986C255.346 34.4473 256.517 31.3905 256.517 27.6284C256.517 23.8662 255.346 20.8486 253.006 18.5757C250.744 16.3027 247.546 15.1662 243.412 15.1662H222.35V85.9419H204.33Z",
  "M280.606 85.9419V1.29324H298.625V85.9419H280.606ZM289.031 85.9419V72.0689H339.111V85.9419H289.031Z",
  "M347.283 85.9419V1.29324H365.302V85.9419H347.283ZM355.708 85.9419V72.0689H410V85.9419H355.708ZM355.708 49.4959V35.8581H405.905V49.4959H355.708ZM355.708 15.1662V1.29324H408.596V15.1662H355.708Z",
];

// Rounded "pill" shapes matching each letter's own bounding box, but
// re-spaced so the gap between consecutive blobs is a constant ~3.12 units
// (each blob keeps its original width/radius/height — only its x-position
// shifts) instead of inheriting the source typeface's uneven kerning.
const BLOB_PATHS = [
  "M35.5,0 H35.5 A35.5,35.5 0 0 1 71,35.5 V51.5 A35.5,35.5 0 0 1 35.5,87 H35.5 A35.5,35.5 0 0 1 0,51.5 V35.5 A35.5,35.5 0 0 1 35.5,0 Z",
  "M92.45,1.29 H92.45 A18.33,18.33 0 0 1 110.78,19.62 V67.61 A18.33,18.33 0 0 1 92.45,85.94 H92.45 A18.33,18.33 0 0 1 74.12,67.61 V19.62 A18.33,18.33 0 0 1 92.45,1.29 Z",
  "M156.23,1.29 H166.88 A42.33,42.33 0 0 1 209.21,43.62 V43.61 A42.33,42.33 0 0 1 166.88,85.94 H156.23 A42.33,42.33 0 0 1 113.90,43.61 V43.62 A42.33,42.33 0 0 1 156.23,1.29 Z",
  "M247.42,1.29 H247.43 A35.1,35.1 0 0 1 282.53,36.39 V50.84 A35.1,35.1 0 0 1 247.43,85.94 H247.42 A35.1,35.1 0 0 1 212.32,50.84 V36.39 A35.1,35.1 0 0 1 247.42,1.29 Z",
  "M314.90,1.29 H314.91 A29.25,29.25 0 0 1 344.16,30.54 V56.69 A29.25,29.25 0 0 1 314.91,85.94 H314.90 A29.25,29.25 0 0 1 285.65,56.69 V30.54 A29.25,29.25 0 0 1 314.90,1.29 Z",
  "M378.64,1.29 H378.64 A31.36,31.36 0 0 1 410,32.65 V54.58 A31.36,31.36 0 0 1 378.64,85.94 H378.64 A31.36,31.36 0 0 1 347.28,54.58 V32.65 A31.36,31.36 0 0 1 378.64,1.29 Z",
];

type FooterLogoProps = {
  className?: string;
};

export default function FooterLogo({ className }: FooterLogoProps) {
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);

  const morphTo = (targets: string[]) => {
    pathRefs.current.forEach((path, i) => {
      if (!path) return;
      gsap.to(path, {
        duration: 0.6,
        delay: i * 0.03,
        ease: "power2.inOut",
        morphSVG: targets[i],
      });
    });
  };

  return (
    <svg
      viewBox="0 0 410 87"
      role="img"
      aria-label="SIMPLE by Rafaa Chawali"
      className={`block ${className ?? ""}`}
      onMouseEnter={() => morphTo(BLOB_PATHS)}
      onMouseLeave={() => morphTo(LETTER_PATHS)}
    >
      <defs>
        {/* White inset highlight tracing each glyph's silhouette. Offset/blur
            are in the SVG's local 410x87 units, which render ~3.5x larger on
            screen (w-full) — these are scaled down from the nominal 4/8/8px
            spec accordingly, and tuned down further since this technique
            (unlike CSS inset box-shadow) covers a larger share of thin
            strokes at equal nominal values. */}
        <filter
          id="footer-logo-inner-shadow"
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
        >
          <feOffset dx="0.5" dy="1" />
          <feGaussianBlur stdDeviation="0.6" result="offset-blur" />
          <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
          <feFlood floodColor="#ffffff" floodOpacity="0.02" result="color" />
          <feComposite operator="in" in="color" in2="inverse" result="shadow" />
          <feComposite operator="over" in="shadow" in2="SourceGraphic" />
        </filter>
      </defs>
      <g fill="#0a0a0a" filter="url(#footer-logo-inner-shadow)">
        {LETTER_PATHS.map((d, i) => (
          <path
            key={i}
            ref={(el) => {
              pathRefs.current[i] = el;
            }}
            d={d}
          />
        ))}
      </g>
    </svg>
  );
}
