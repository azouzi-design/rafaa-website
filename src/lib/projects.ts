export type Project = {
  slug: string;
  title: string;
  // Short blurb shown on the project page. Placeholder copy — swap in real
  // case-study text once available, same as the images below.
  description: string;
  // Placeholder stills reusing the About section's photos, same as
  // ProjectsList's own thumbnails — swap for real project stills once
  // available.
  coverImage: string;
  // Hosted on Vercel Blob (same store as the hero video) rather than
  // committed to the repo — these are real per-project case-study clips and
  // too large for git. width/height are the source file's own dimensions
  // (via ffprobe) so ProjectsList can size each hover preview to its real
  // aspect ratio instead of forcing every project into the same shape.
  coverVideo: {
    src: string;
    width: number;
    height: number;
  };
  gallery: string[];
};

export const PROJECTS: Project[] = [
  {
    slug: "cynoia",
    title: "Cynoia",
    description:
      "A full-funnel content push built around Cynoia's product launches, video-first from concept through delivery so the story stayed consistent across every touchpoint.",
    coverImage: "/images/about/about-02.jpg",
    coverVideo: {
      src: "https://nc4bbxof81dtn2uz.public.blob.vercel-storage.com/projects/cynoia-ngIPHOTFCZeAw0qmifstafkFSiCgN7.webm",
      width: 1920,
      height: 1080,
    },
    gallery: ["/images/about/about-06.jpeg", "/images/about/about-09.jpeg"],
  },
  {
    slug: "fabskill",
    title: "Fabskill",
    description:
      "Creative direction and production for Fabskill's brand campaign, pairing high-end video with a visual identity built to travel across social, web, and paid.",
    coverImage: "/images/about/about-01.jpg",
    coverVideo: {
      src: "https://nc4bbxof81dtn2uz.public.blob.vercel-storage.com/projects/fabskill-BwetmYXfIDO0T2uQYcFxO4QSMruNi1.mp4",
      width: 720,
      height: 1280,
    },
    gallery: ["/images/about/about-07.jpeg", "/images/about/about-10.jpeg"],
  },
  {
    slug: "spectra-la-rose",
    title: "Spectra La Rose",
    description:
      "Campaign concept, shoot, and post for Spectra La Rose — a product showcase built to make a new launch feel unmistakably premium.",
    coverImage: "/images/about/about-05.jpg",
    coverVideo: {
      src: "https://nc4bbxof81dtn2uz.public.blob.vercel-storage.com/projects/spectra-la-rose-xFhhohAh6mPuJ1OqOg37ZYFsp9T0sd.mp4",
      width: 720,
      height: 1280,
    },
    gallery: ["/images/about/about-08.jpeg", "/images/about/about-11.jpg"],
  },
  {
    slug: "jam-music-academy",
    title: "Jam Music Academy",
    description:
      "An ongoing content roadmap for Jam Music Academy, turning everyday studio moments into a steady stream of social-first video.",
    coverImage: "/images/about/about-03.jpg",
    coverVideo: {
      src: "https://nc4bbxof81dtn2uz.public.blob.vercel-storage.com/projects/jam-music-academy-tPjespo0XaV8FYxS1Gy4t30vWnsX9o.mp4",
      width: 720,
      height: 1280,
    },
    gallery: ["/images/about/about-13.png", "/images/about/about-04.jpg"],
  },
  {
    slug: "oakley-x-cactus-jack",
    title: "Oakley x Cactus Jack",
    description:
      "Event coverage and an aftermovie for the Oakley x Cactus Jack collaboration, cut for pace and built to spread fast.",
    coverImage: "/images/about/about-01.jpg",
    coverVideo: {
      src: "https://nc4bbxof81dtn2uz.public.blob.vercel-storage.com/projects/oakley-x-cactus-jack-txSmL3DMG8oRBcNq5iy8P7H2mC0kSg.webm",
      width: 1920,
      height: 936,
    },
    gallery: ["/images/about/about-02.jpg", "/images/about/about-06.jpeg"],
  },
  {
    slug: "radhi-chawali-hide-and-seek",
    title: 'Radhi Chawali — "Hide & Seek"',
    description:
      "Music video direction and production for Radhi Chawali's \"Hide & Seek,\" built around a single strong visual idea carried through every shot.",
    coverImage: "/images/about/about-04.jpg",
    coverVideo: {
      // Re-encoded with an extra 90deg counter-clockwise rotation baked in
      // (ffmpeg transpose=2) — the source file's own rotation metadata
      // alone left it displaying sideways.
      src: "https://nc4bbxof81dtn2uz.public.blob.vercel-storage.com/projects/radhi-chawali-hide-and-seek-BbNgaWvjuIn2mQyrbQ1RFZSd468mC7.mp4",
      width: 1080,
      height: 1920,
    },
    gallery: ["/images/about/about-09.jpeg", "/images/about/about-05.jpg"],
  },
];

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}
