import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectHeader from "@/components/ProjectHeader";
import ProjectHero from "@/components/ProjectHero";
import ProjectVideoShowcase from "@/components/ProjectVideoShowcase";
import ProjectMetricsSection from "@/components/ProjectMetricsSection";
import ProjectsCatalogue from "@/components/ProjectsCatalogue";
import Footer from "@/components/Footer";
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

        {/* First video, then metrics, then the rest — metrics sit right
            after the opening video rather than after the whole showcase. */}
        <ProjectVideoShowcase videos={project.videos?.slice(0, 1)} />
        <ProjectMetricsSection metrics={project.metrics} />
        <ProjectVideoShowcase videos={project.videos?.slice(1)} />

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
