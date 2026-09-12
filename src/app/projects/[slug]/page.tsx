import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectHeader from "@/components/ProjectHeader";
import ProjectHero from "@/components/ProjectHero";
import ProjectsCatalogue from "@/components/ProjectsCatalogue";
import Footer from "@/components/Footer";
import RevealOnScroll from "@/components/RevealOnScroll";
import { PROJECTS, getProject } from "@/lib/projects";

export function generateStaticParams() {
  return PROJECTS.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata(
  props: PageProps<"/projects/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const project = getProject(slug);
  if (!project) return {};

  return {
    title: `${project.title} — SIMPLE by Rafaa Chawali`,
    description: project.description,
  };
}

export default async function ProjectPage(
  props: PageProps<"/projects/[slug]">,
) {
  const { slug } = await props.params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <>
      <ProjectHeader />

      {/* relative z-10 so this sits in its own stacking context above
          Footer's fixed z-0 — see page.tsx (home) for the full explanation
          of why an unpositioned <main> would otherwise let Footer paint on
          top of it from the very start instead of staying hidden behind it
          until scrolled past. */}
      <main className="relative z-10 bg-black">
        <ProjectHero project={project} />

        <div className="grid snap-start grid-cols-1 gap-2 p-2 sm:grid-cols-2">
          {project.gallery.map((src, i) => (
            <RevealOnScroll key={src} delay={i * 100}>
              <div className="aspect-[3/4] overflow-hidden rounded-[2px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="h-full w-full object-cover" />
              </div>
            </RevealOnScroll>
          ))}
        </div>

        <ProjectsCatalogue currentSlug={project.slug} />
      </main>

      {/* Reserves Footer's own (fixed) height so scrolling past the
          catalogue uncovers it, same trick page.tsx uses for the homepage —
          see Footer.tsx for why this can't just be a normal in-flow footer. */}
      <div
        aria-hidden
        className="pointer-events-none w-full snap-end"
        style={{ height: "var(--footer-h, 0px)" }}
      />
      <Footer />
    </>
  );
}
