import HeroVideo from "@/components/HeroVideo";
import Navbar from "@/components/Navbar";
import HeroNav from "@/components/HeroNav";
import Logo from "@/components/Logo";
import Footer from "@/components/Footer";
import ProjectsList from "@/components/ProjectsList";
import AboutSection from "@/components/AboutSection";
import ServicesList from "@/components/ServicesList";
import ContactSection from "@/components/ContactSection";
import RevealOnScroll from "@/components/RevealOnScroll";

const CREATIVE_PARTNER_PACK = [
  "Creative Strategy",
  "Continuous Content Roadmapping",
  "Performance Creative Direction",
  "Full-Funnel Content Planning",
  "Visual Identity Management",
  "Value Proposition Framing",
  "Marketing & Content Strategy",
  "Brand Positioning & Messaging",
  "Embedded Creative Leadership",
  "Brand Storytelling & Narrative",
  "Creative Testing & Iteration",
];

const PRODUCTION_PACK = [
  "Campaign Concepts",
  "Storyboarding & Scripting",
  "High-End Video Production",
  "AI-Powered Video Marketing",
  "On-Set Shooting & Direction",
  "Commercial Video & Photography",
  "Full-Service Post-Production",
  "Event Aftermovies & Recaps",
  "High-Impact Product Showcases",
  "Campaign Launch Execution",
  "High-Converting Video Ads",
  "Motion Graphics & Visual Effects",
  "Social Media Content Batching",
  "Color Grading & Audio Mixing",
  "Multi-Format Asset Delivery",
];

export default function Home() {
  return (
    <>
      <Navbar />

      {/*
        Positioned + z-10 so this whole block sits in one explicit,
        unambiguous stacking context above Footer (see Footer.tsx). Footer
        used to rely on a *negative* z-index instead, with only the plain
        (non-positioned) <body> as its containing block — a well-known CSS
        hit-testing gotcha: body's own implicit paint layer, even fully
        transparent, sits in front of negative-z-index content for pointer
        events, making it permanently unclickable regardless of what's
        actually visible. Comparing two positive z-indices within one real
        stacking context avoids that entirely.
      */}
      <main className="relative z-10">
        <div id="hero" className="relative snap-start">
          <HeroVideo />
          <HeroNav />
          <div className="absolute bottom-4 left-4 z-10 mix-blend-difference flex flex-col items-start gap-4">
            <RevealOnScroll delay={1100}>
              <p className="text-paragraph text-white">
                By Rafaa Chawali ® Creative partner
                <br />
                who specializes in video marketing
              </p>
            </RevealOnScroll>
            <RevealOnScroll delay={1250}>
              <Logo className="aspect-[410/87] h-[112px]" />
            </RevealOnScroll>
          </div>
        </div>

        <section id="about" className="h-screen w-full snap-start bg-black">
          <AboutSection />
        </section>
        <section id="projects" className="h-screen w-full snap-start bg-black">
          <ProjectsList />
        </section>
        <section id="services-1" className="h-screen w-full snap-start bg-black">
          <ServicesList
            packName="Creative Partner Pack"
            description="Best for brands needing high-level vision, ongoing strategic direction, and complete creative ownership."
            items={CREATIVE_PARTNER_PACK}
          />
        </section>
        <section id="services-2" className="h-screen w-full snap-start bg-black">
          <ServicesList
            side="left"
            packName="Production Pack"
            description="Best for brands and agencies needing expert strategy, scripting, and high-end execution for specific, one-shot campaigns or video marketing projects."
            items={PRODUCTION_PACK}
          />
        </section>
        <section id="contact" className="h-screen w-full snap-start bg-black">
          <ContactSection />
        </section>
      </main>

      {/*
        Footer (see Footer.tsx) is `fixed` at the viewport bottom from the
        very start, permanently behind <main> above (z-0 vs main's z-10) —
        it's covered by their opaque backgrounds the whole time. This
        spacer is the only reason it's ever seen: it reserves exactly
        Footer's own height (--footer-h, published by Footer.tsx) of
        extra, transparent scroll room after Contact, so scrolling through
        it is what uncovers the fixed Footer beneath — Contact scrolls up
        and away while Footer stays put, already in place.
      */}
      <div
        aria-hidden
        className="pointer-events-none w-full snap-end"
        style={{ height: "var(--footer-h, 0px)" }}
      />

      <Footer />
    </>
  );
}
