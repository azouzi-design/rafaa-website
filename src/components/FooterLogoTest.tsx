"use client";

// TEMPORARY test harness — the sole surviving hover-distortion candidate
// for the footer logo (squash/wobble and gooey-puff were both tried and
// ruled out). Once this one's confirmed, this file gets deleted and
// FooterLogo.tsx gets rebuilt around it directly.

import { useEffect, useRef } from "react";
import gsap from "gsap";

// Exact path data from public/images/logo.svg (S / I / M / P / L / E) —
// duplicated from FooterLogo.tsx for the duration of this test only.
const LETTER_PATHS = [
  "M37.677 87C26.7562 87 18.0194 84.5703 11.4669 79.7108C4.9144 74.773 1.09209 67.8365 0 58.9014H17.3174C17.8634 63.4473 20.0476 67.0527 23.8699 69.7176C27.6922 72.3041 32.5676 73.5973 38.4961 73.5973C43.3325 73.5973 47.0378 72.7351 49.612 71.0108C52.2642 69.2865 53.5903 66.9743 53.5903 64.0743C53.5903 61.3311 52.8102 59.1365 51.2501 57.4905C49.69 55.7662 46.9988 54.3946 43.1765 53.3757L27.4972 49.0257C19.4626 46.7527 13.5731 43.6568 9.82879 39.7378C6.1625 35.7405 4.32935 30.7635 4.32935 24.8068C4.32935 19.7122 5.61645 15.323 8.19066 11.6392C10.8429 7.87703 14.5482 5.01621 19.3066 3.05675C24.0649 1.01892 29.6424 0 36.0389 0C45.8677 0 53.7073 2.35135 59.5578 7.05405C65.4083 11.6784 68.7235 17.8311 69.5036 25.5122H52.1862C51.4061 21.3581 49.495 18.3014 46.4527 16.3419C43.4885 14.3824 39.6662 13.4027 34.9858 13.4027C30.9295 13.4027 27.6922 14.1865 25.274 15.7541C22.8558 17.3216 21.6467 19.4378 21.6467 22.1027C21.6467 24.1405 22.3098 26.0216 23.6359 27.7459C24.962 29.3919 27.7312 30.8027 31.9436 31.9784L47.6228 36.3284C55.8915 38.6014 61.82 41.7365 65.4082 45.7338C69.0745 49.6527 70.9077 54.6297 70.9077 60.6649C70.9077 69.1297 67.9825 75.6351 62.132 80.1811C56.2815 84.727 48.1299 87 37.677 87Z",
  "M70.1289 85.9419L88.7711 1.29324H106.791L88.1483 85.9419H70.1289Z",
  "M102.061 85.9419L111.071 1.29324H133.771L154.482 85.2365H144.77L165.364 1.29324H188.18L197.307 85.9419H179.522L171.097 3.9973H177.65L158.577 85.9419H139.972L121.134 4.7027H127.452L119.145 85.9419H102.061Z",
  "M204.33 85.9419V1.29324H244.348C250.588 1.29324 255.932 2.39054 260.378 4.58513C264.902 6.77973 268.374 9.83648 270.792 13.7554C273.288 17.6743 274.536 22.2595 274.536 27.5108C274.536 32.7622 273.288 37.3865 270.792 41.3838C268.296 45.3811 264.785 48.5162 260.261 50.7892C255.815 52.9838 250.51 54.0811 244.348 54.0811H218.606V40.2081H243.412C247.546 40.2081 250.744 39.0716 253.006 36.7986C255.346 34.4473 256.517 31.3905 256.517 27.6284C256.517 23.8662 255.346 20.8486 253.006 18.5757C250.744 16.3027 247.546 15.1662 243.412 15.1662H222.35V85.9419H204.33Z",
  "M280.606 85.9419V1.29324H298.625V85.9419H280.606ZM289.031 85.9419V72.0689H339.111V85.9419H289.031Z",
  "M347.283 85.9419V1.29324H365.302V85.9419H347.283ZM355.708 85.9419V72.0689H410V85.9419H355.708ZM355.708 49.4959V35.8581H405.905V49.4959H355.708ZM355.708 15.1662V1.29324H408.596V15.1662H355.708Z",
];

const LABEL_CLASS = "text-subtitle text-black/60";

// Converts a mouse event's viewport coordinates into the SVG's own
// 410x87 user-space (accounting for however large the element is
// actually rendered on screen), so hit-testing against path geometry
// (in that same 410x87 space) lines up regardless of layout size.
function toSvgPoint(svg: SVGSVGElement, clientX: number, clientY: number) {
  const pt = svg.createSVGPoint();
  pt.x = clientX;
  pt.y = clientY;
  const ctm = svg.getScreenCTM();
  if (!ctm) return { x: 0, y: 0 };
  const local = pt.matrixTransform(ctm.inverse());
  return { x: local.x, y: local.y };
}

// The always-visible, never-distorted copy every variant sits on top of —
// this is "the second one under it": at rest the two are pixel-identical,
// so the logo reads exactly as it does today, and only the top copy's
// local distortion (near the cursor) ever shows.
function DuplicateLogoBase() {
  return (
    <g fill="#0a0a0a">
      {LETTER_PATHS.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </g>
  );
}

// How far (in the 410x87 viewBox's own units — a letter is ~87 tall) the
// reveal window reaches once fully open. Bumped up from 55 — the effect
// read as too small/localized.
const HOVER_RADIUS = 95;

// Liquid warp: the top copy's own displacement strength ramps up/down
// together with the reveal radius (not just the window it shows through),
// so entering/leaving reads as the ripple itself growing and settling.
// Position-following uses gsap.quickTo (one persistent tween retargeted
// every move) instead of firing a fresh tween per mousemove.
function LogoLiquid({ className }: { className?: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const gradientRef = useRef<SVGRadialGradientElement>(null);
  const turbRef = useRef<SVGFETurbulenceElement>(null);
  const dispRef = useRef<SVGFEDisplacementMapElement>(null);
  const proxy = useRef({ x: 205, y: 43.5, r: 0, scale: 0, freq: 0.028 });
  const moveX = useRef<(v: number) => void>(null);
  const moveY = useRef<(v: number) => void>(null);

  const sync = () => {
    const g = gradientRef.current;
    if (g) {
      g.setAttribute("cx", String(proxy.current.x));
      g.setAttribute("cy", String(proxy.current.y));
      g.setAttribute("r", String(proxy.current.r));
    }
    dispRef.current?.setAttribute("scale", String(proxy.current.scale));
    turbRef.current?.setAttribute("baseFrequency", String(proxy.current.freq));
  };

  useEffect(() => {
    moveX.current = gsap.quickTo(proxy.current, "x", { duration: 0.3, ease: "power3", onUpdate: sync });
    moveY.current = gsap.quickTo(proxy.current, "y", { duration: 0.3, ease: "power3", onUpdate: sync });
  }, []);

  const onEnter = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const p = toSvgPoint(svg, e.clientX, e.clientY);
    proxy.current.x = p.x;
    proxy.current.y = p.y;
    gsap.to(proxy.current, {
      r: HOVER_RADIUS,
      scale: 22,
      freq: 0.02,
      duration: 0.55,
      ease: "power2.out",
      overwrite: "auto",
      onUpdate: sync,
    });
  };

  const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const p = toSvgPoint(svg, e.clientX, e.clientY);
    moveX.current?.(p.x);
    moveY.current?.(p.y);
  };

  const onLeave = () => {
    gsap.to(proxy.current, {
      r: 0,
      scale: 0,
      freq: 0.028,
      duration: 0.5,
      ease: "power2.out",
      overwrite: "auto",
      onUpdate: sync,
    });
  };

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 410 87"
      role="img"
      aria-label="SIMPLE by Rafaa Chawali"
      className={`block ${className ?? ""}`}
      onMouseEnter={onEnter}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <defs>
        {/* Bigger scale needs a wider filter region, or the displaced edges
            clip against the filter's own bounding box. */}
        <filter id="logo-test-liquid" x="-60%" y="-60%" width="220%" height="220%">
          <feTurbulence ref={turbRef} type="fractalNoise" baseFrequency="0.028" numOctaves={2} seed={3} result="noise" />
          <feDisplacementMap
            ref={dispRef}
            in="SourceGraphic"
            in2="noise"
            scale={0}
            xChannelSelector="R"
            yChannelSelector="G"
            result="displaced"
          />
          {/* Displacing a shape drags its antialiased edge pixels (partial
              alpha) along with it, and a wavier edge has more perimeter for
              those partial pixels to live on — that's the grey fringe. This
              re-thresholds alpha back to a hard 0-or-1 cut, so the warped
              silhouette stays solid black right up to its (now wavy) edge
              instead of fading through grey. */}
          <feColorMatrix
            in="displaced"
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 28 -13"
          />
        </filter>
        {/* Reveal mask: nearly a hard-edged circle (solid out to 92% of its
            radius, feathering only in the last 8%) rather than fading
            across the whole radius — a wide feather was blending the
            (shifted) warped copy at partial opacity over most of the
            reveal, which is a second, independent source of the same grey
            smudge regardless of how solid the warp itself is. */}
        <radialGradient ref={gradientRef} id="logo-test-liquid-grad" gradientUnits="userSpaceOnUse" cx={205} cy={43.5} r={0}>
          <stop offset="0%" stopColor="#fff" />
          <stop offset="92%" stopColor="#fff" />
          <stop offset="100%" stopColor="#fff" stopOpacity={0} />
        </radialGradient>
        <mask id="logo-test-liquid-mask" maskUnits="userSpaceOnUse" x={0} y={0} width={410} height={87}>
          <rect x={0} y={0} width={410} height={87} fill="url(#logo-test-liquid-grad)" />
        </mask>
      </defs>
      <DuplicateLogoBase />
      <g fill="#0a0a0a" filter="url(#logo-test-liquid)" mask="url(#logo-test-liquid-mask)">
        {LETTER_PATHS.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
    </svg>
  );
}

type FooterLogoTestProps = {
  className?: string;
};

export default function FooterLogoTest({ className }: FooterLogoTestProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className={LABEL_CLASS}>B — Liquid warp (localized to cursor)</p>
      <LogoLiquid className={className} />
    </div>
  );
}
