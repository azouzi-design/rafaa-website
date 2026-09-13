export type ProjectVideo = {
  src: string;
  // Display dimensions (post sample-aspect-ratio correction, not always
  // 1:1 — check both via ffprobe), same caveat as coverVideo below.
  width: number;
  height: number;
};

export type Project = {
  slug: string;
  title: string;
  // Short blurb shown on the project page. Placeholder copy — swap in real
  // case-study text once available, same as the images below.
  description: string;
  // A real still frame from the project's own coverVideo (extracted via
  // ffprobe/ffmpeg, not a designed poster) — shown as the <video poster>
  // while a video hasn't buffered enough to paint its own first frame yet,
  // so it now matches the project instead of showing an unrelated About
  // section photo.
  coverImage: string;
  // Hosted on Vercel Blob (same store as the hero video) rather than
  // committed to the repo — these are real per-project case-study clips and
  // too large for git. width/height are the source file's *display*
  // dimensions (coded width/height adjusted for sample aspect ratio, not
  // always 1:1 — check both via ffprobe) so ProjectsList can size each
  // hover preview to its real aspect ratio instead of forcing every
  // project into the same shape.
  coverVideo: {
    src: string;
    width: number;
    height: number;
  };
  // Full-viewport-height video sections shown right after the hero, one
  // per project video, rendered by ProjectVideoShowcase. Populated
  // per-project as real footage becomes available — undefined/empty for
  // projects not yet populated (renders nothing).
  videos?: ProjectVideo[];
};

export const PROJECTS: Project[] = [
  {
    slug: "cynoia",
    title: "Cynoia",
    description:
      "A full-funnel content push built around Cynoia's product launches, video-first from concept through delivery so the story stayed consistent across every touchpoint.",
    coverImage: "/images/projects/cynoia.jpg",
    coverVideo: {
      src: "https://nc4bbxof81dtn2uz.public.blob.vercel-storage.com/projects/cynoia-s9t6Tbav8f68RunHW9E66KUg6tCeVX.webm",
      width: 1920,
      height: 1080,
    },
    videos: [
      {
        // employer-branding-video-behind-the-scenes-rafaa-chawali.webm
        src: "https://nc4bbxof81dtn2uz.public.blob.vercel-storage.com/projects/cynoia-2-n5O9kvuXdsCaNdQnWoegOamSaUEWX1.webm",
        width: 608,
        height: 1080,
      },
      {
        // community-building-social-media-video-rafaa-chawali.webm
        src: "https://nc4bbxof81dtn2uz.public.blob.vercel-storage.com/projects/cynoia-3-ufqZmzYwfYo17Pusp4dbbHDM1AxE4w.webm",
        width: 360,
        height: 640,
      },
      {
        // b2b-saas-launch-video-rafaa-chawali.webm
        src: "https://nc4bbxof81dtn2uz.public.blob.vercel-storage.com/projects/cynoia-4-MbktpHfS9gRQ1LVWSOdPUZtIcM9LQQ.webm",
        width: 608,
        height: 1080,
      },
      {
        // product-launch-video-rafaa-chawali.webm
        src: "https://nc4bbxof81dtn2uz.public.blob.vercel-storage.com/projects/cynoia-5-ObCJfnfnwLG921wty82gt5zK4SY6tu.webm",
        width: 608,
        height: 1080,
      },
      {
        // go-to-market-video-strategy-rafaa-chawali.webm
        src: "https://nc4bbxof81dtn2uz.public.blob.vercel-storage.com/projects/cynoia-6-hKy14OB3WtvMVTKrLCFAowKJxwSGNr.webm",
        width: 608,
        height: 1080,
      },
      {
        // cover project - launch-video-case-study-rafaa-chawali.webm —
        // same file as coverVideo above, reused rather than re-uploaded.
        src: "https://nc4bbxof81dtn2uz.public.blob.vercel-storage.com/projects/cynoia-s9t6Tbav8f68RunHW9E66KUg6tCeVX.webm",
        width: 1920,
        height: 1080,
      },
    ],
  },
  {
    slug: "fabskill",
    title: "Fabskill",
    description:
      "Creative direction and production for Fabskill's brand campaign, pairing high-end video with a visual identity built to travel across social, web, and paid.",
    coverImage: "/images/projects/fabskill.jpg",
    coverVideo: {
      src: "https://nc4bbxof81dtn2uz.public.blob.vercel-storage.com/projects/fabskill-I7Rs2U8XsH3vUfc9JU4bsMHCZgOE41.webm",
      width: 635,
      height: 1080,
    },
    videos: [
      {
        // "Slush rafaa chawali, marketing.webm"
        src: "https://nc4bbxof81dtn2uz.public.blob.vercel-storage.com/projects/fabskill-2-FL5pIIDOc27cuShQJ2LZhswzUwTMjh.webm",
        width: 1080,
        height: 1080,
      },
      {
        // Podcast - Fabverse/growth-marketing-content-strategy-rafaa-chawali.webm
        src: "https://nc4bbxof81dtn2uz.public.blob.vercel-storage.com/projects/fabskill-3-fuZI1JEX3hXijMHDA7b3n6wBIt9gSe.webm",
        width: 1920,
        height: 1080,
      },
      {
        // Mobile app launch/startup-launch-campaign-rafaa-chawali.mp4
        src: "https://nc4bbxof81dtn2uz.public.blob.vercel-storage.com/projects/fabskill-4-Ds6qdB7A05ViA91NUvIQ0m9iu3R6hg.mp4",
        width: 720,
        height: 1280,
      },
      {
        // Mobile app launch/creative-direction-brand-video-rafaa-chawali.mp4
        src: "https://nc4bbxof81dtn2uz.public.blob.vercel-storage.com/projects/fabskill-5-GpjTAckJB9z9zImcslKEzSsVJLIcWm.mp4",
        width: 720,
        height: 1280,
      },
      {
        // Mobile app launch/go-to-market-strategy-video-rafaa-chawali.mp4
        src: "https://nc4bbxof81dtn2uz.public.blob.vercel-storage.com/projects/fabskill-6-YLN0bofOtzvs6J3S2JlL41Im7A5IYD.mp4",
        width: 1280,
        height: 720,
      },
      {
        // Mobile app launch/b2b-saas-content-strategy-rafaa-chawali.mp4
        src: "https://nc4bbxof81dtn2uz.public.blob.vercel-storage.com/projects/fabskill-7-sEwkYlA9Li7p9yoXziAaZHzYfVjPIX.mp4",
        width: 1920,
        height: 1080,
      },
      {
        // E-learning/Creative direction, video marketing, videos, system design.mp4
        src: "https://nc4bbxof81dtn2uz.public.blob.vercel-storage.com/projects/fabskill-8-1bbmDV8JifdYfGrighbo0nVB0XGzhL.mp4",
        width: 1920,
        height: 1080,
      },
      {
        // E-learning/Le Coach - LinkedIn Booster Workshop.mp4
        src: "https://nc4bbxof81dtn2uz.public.blob.vercel-storage.com/projects/fabskill-9-p1Qn9JnGHB3bfHKGviKbhlwttCrSKp.mp4",
        width: 1920,
        height: 1080,
      },
      {
        // E-learning/Yasmine olympics, rafaa chawali, marketing digital, gtm, go to market.mp4
        src: "https://nc4bbxof81dtn2uz.public.blob.vercel-storage.com/projects/fabskill-10-GzB9JrDPel3KrdOULbzmg6Hoi92hxi.mp4",
        width: 1280,
        height: 720,
      },
      {
        // Cover project - video-marketing-case-study-rafaa-chawali.webm —
        // same file as coverVideo above, reused rather than re-uploaded.
        src: "https://nc4bbxof81dtn2uz.public.blob.vercel-storage.com/projects/fabskill-I7Rs2U8XsH3vUfc9JU4bsMHCZgOE41.webm",
        width: 635,
        height: 1080,
      },
    ],
  },
  {
    slug: "spectra-la-rose",
    title: "Spectra La Rose",
    description:
      "Campaign concept, shoot, and post for Spectra La Rose — a product showcase built to make a new launch feel unmistakably premium.",
    coverImage: "/images/projects/spectra-la-rose.jpg",
    coverVideo: {
      src: "https://nc4bbxof81dtn2uz.public.blob.vercel-storage.com/projects/spectra-la-rose-XKp38sNcMB5yOGTFUFov9U5w1MuUF0.mp4",
      width: 720,
      height: 1280,
    },
    videos: [
      {
        // "creative direction rafaa chawali, video marketing, videos,
        // simple, marketing agency tunis.mp4"
        src: "https://nc4bbxof81dtn2uz.public.blob.vercel-storage.com/projects/spectra-la-rose-2-IKBusUWC0wIKrKuPFSvQqjb59x0Bie.mp4",
        width: 720,
        height: 1280,
      },
      {
        // Cover Project - SPECTRA LA ROSE...mp4 — same file as coverVideo
        // above, reused rather than re-uploaded.
        src: "https://nc4bbxof81dtn2uz.public.blob.vercel-storage.com/projects/spectra-la-rose-XKp38sNcMB5yOGTFUFov9U5w1MuUF0.mp4",
        width: 720,
        height: 1280,
      },
    ],
  },
  {
    slug: "jam-music-academy",
    title: "Jam Music Academy",
    description:
      "An ongoing content roadmap for Jam Music Academy, turning everyday studio moments into a steady stream of social-first video.",
    coverImage: "/images/projects/jam-music-academy.jpg",
    coverVideo: {
      src: "https://nc4bbxof81dtn2uz.public.blob.vercel-storage.com/projects/jam-music-academy-JrypegLAnvpbKE00Jayr4Fax90LEwP.webm",
      width: 608,
      height: 1080,
    },
    videos: [
      {
        // launch-campaign-strategy-rafaa-chawali.webm — horizontal
        src: "https://nc4bbxof81dtn2uz.public.blob.vercel-storage.com/projects/jam-music-academy-2-5bb6HVBeNKnMZIcWYXQXyTTFMXFEo1.webm",
        width: 1278,
        height: 720,
      },
      {
        // founder-led-launch-video-rafaa-chawali.webm — vertical
        src: "https://nc4bbxof81dtn2uz.public.blob.vercel-storage.com/projects/jam-music-academy-3-tTUyxtRceKCwkZXjr3tFCsKzfO7BlK.webm",
        width: 608,
        height: 1080,
      },
      {
        // Cover Project - launch-video-case-study-rafaa-chawali.webm —
        // same file as coverVideo above, reused rather than re-uploaded.
        src: "https://nc4bbxof81dtn2uz.public.blob.vercel-storage.com/projects/jam-music-academy-JrypegLAnvpbKE00Jayr4Fax90LEwP.webm",
        width: 608,
        height: 1080,
      },
    ],
  },
  {
    slug: "oakley-x-cactus-jack",
    title: "Oakley x Cactus Jack",
    description:
      "Event coverage and an aftermovie for the Oakley x Cactus Jack collaboration, cut for pace and built to spread fast.",
    coverImage: "/images/projects/oakley-x-cactus-jack.jpg",
    coverVideo: {
      src: "https://nc4bbxof81dtn2uz.public.blob.vercel-storage.com/projects/oakley-x-cactus-jack-QI18OnN01EAMfgVLMbmHdQxXYwr8Nn.webm",
      width: 2212,
      height: 936,
    },
    // No `videos` — this is the only clip found for this project (raw-assets
    // has just the one cover video, no additional footage to showcase).
  },
  {
    slug: "radhi-chawali-hide-and-seek",
    title: 'Radhi Chawali — "Hide & Seek"',
    description:
      "Music video direction and production for Radhi Chawali's \"Hide & Seek,\" built around a single strong visual idea carried through every shot.",
    coverImage: "/images/projects/radhi-chawali-hide-and-seek.jpg",
    coverVideo: {
      src: "https://nc4bbxof81dtn2uz.public.blob.vercel-storage.com/projects/radhi-chawali-hide-and-seek-ypgV6tS9EV634SsVzJB9e5lBiMFeFJ.webm",
      width: 608,
      height: 1080,
    },
    videos: [
      {
        // "65k views instagram organic.webm"
        src: "https://nc4bbxof81dtn2uz.public.blob.vercel-storage.com/projects/radhi-chawali-hide-and-seek-2-5qMkwqbbEDD2o4IkrbZTB7cqTe6HFw.webm",
        width: 608,
        height: 1080,
      },
      {
        // Cover project (1).webm — same file as coverVideo above, reused
        // rather than re-uploaded.
        src: "https://nc4bbxof81dtn2uz.public.blob.vercel-storage.com/projects/radhi-chawali-hide-and-seek-ypgV6tS9EV634SsVzJB9e5lBiMFeFJ.webm",
        width: 608,
        height: 1080,
      },
    ],
  },
];

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}
