import RevealOnScroll from "@/components/RevealOnScroll";

// Image order matches the Figma track exactly; each box is 360px tall with
// width left to the image's own natural aspect ratio (that's also why the
// Figma widths per photo line up 1:1 with each file's real aspect ratio).
const IMAGE_TRACK = [
  "/images/about/about-02.jpg",
  "/images/about/about-05.jpg",
  "/images/about/about-01.jpg",
  "/images/about/about-04.jpg",
  "/images/about/about-03.jpg",
];

export default function AboutSection() {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="absolute top-[20px] right-[20px] z-10 flex w-[800px] flex-col gap-8 text-right">
        <RevealOnScroll>
          <p className="text-big text-white">
            I&apos;ve been making content since I was a kid, photography,
            design, video. Marketing came later, but it made sense
            immediately: it&apos;s science and art on the same plate, and I
            wanted both.
          </p>
        </RevealOnScroll>
        <RevealOnScroll delay={150}>
          <p className="text-big text-white">
            Years of sales, strategy, and content taught me one thing, no
            matter how complex the problem, people trust what they can see,
            hear, and feel. That&apos;s why I built SIMPLE. Video-first
            stories that make complexity easy to trust.
          </p>
        </RevealOnScroll>
      </div>

      <RevealOnScroll delay={300} className="absolute bottom-[6px] left-0">
        <div className="flex w-max animate-[marquee_28s_linear_infinite] items-center gap-[6px]">
          {[...IMAGE_TRACK, ...IMAGE_TRACK].map((src, i) => (
            <div
              key={i}
              className="h-[360px] shrink-0 overflow-hidden rounded-[2px] opacity-[0.97]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                className="pointer-events-none h-full w-auto object-cover"
              />
            </div>
          ))}
        </div>
      </RevealOnScroll>
    </div>
  );
}
