import { media } from "@/lib/media";

export type ProjectVideo = {
  // Primary file — AV1 WebM for most clips, H.264 MP4 for the few that
  // only exist as MP4.
  src: string;
  // H.264 MP4 copy of an AV1 `src`, for browsers without AV1 decode
  // (notably Safari on pre-M3 Macs / pre-iPhone-15-Pro). See VideoSources.
  fallbackSrc?: string;
  // Display dimensions (post sample-aspect-ratio correction, not always
  // 1:1 — check both via ffprobe), same caveat as coverVideo below.
  width: number;
  height: number;
};

export type ProjectMetric = {
  value: string;
  label: string;
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
  // Hosted on Cloudflare R2 (see lib/media.ts) rather than
  // committed to the repo — these are real per-project case-study clips and
  // too large for git. width/height are the source file's *display*
  // dimensions (coded width/height adjusted for sample aspect ratio, not
  // always 1:1 — check both via ffprobe) so ProjectsList can size each
  // hover preview to its real aspect ratio instead of forcing every
  // project into the same shape.
  coverVideo: ProjectVideo;
  // Full-viewport-height video sections shown right after the hero, one
  // per project video, rendered by ProjectVideoShowcase. Populated
  // per-project as real footage becomes available — undefined/empty for
  // projects not yet populated (renders nothing).
  videos?: ProjectVideo[];
  // A full-viewport-height metrics section (ProjectMetricsSection),
  // inserted right after the first video section. Figma lays these out by
  // count, each card touching its neighbors' corners exactly — the array
  // order encodes visual position, not importance:
  //  - 1 metric: the sole card (fills the bottom-right screen quadrant)
  //  - 2 metrics: [bottom-left, top-right]
  //  - 3 metrics: [top-left, top-right, bottom-center]
  // Undefined for the one project (oakley-x-cactus-jack) with no metrics
  // design yet — renders nothing.
  metrics?: ProjectMetric[];
};

export const PROJECTS: Project[] = [
  {
    slug: "cynoia",
    title: "Cynoia",
    description:
      "A full-funnel content push built around Cynoia's product launches, video-first from concept through delivery so the story stayed consistent across every touchpoint.",
    coverImage: "/images/projects/cynoia.jpg",
    coverVideo: {
      src: media("projects/cynoia-dfdef97a.webm"),
      fallbackSrc: media("projects/cynoia-5d7234ac.mp4"),
      width: 1920,
      height: 1080,
    },
    videos: [
      {
        // employer-branding-video-behind-the-scenes-rafaa-chawali.webm
        src: media("projects/cynoia-2-17a583c7.webm"),
        fallbackSrc: media("projects/cynoia-2-9d202ad5.mp4"),
        width: 608,
        height: 1080,
      },
      {
        // community-building-social-media-video-rafaa-chawali.webm
        src: media("projects/cynoia-3-95b5d9ae.webm"),
        fallbackSrc: media("projects/cynoia-3-2a5b9359.mp4"),
        width: 360,
        height: 640,
      },
      {
        // b2b-saas-launch-video-rafaa-chawali.webm
        src: media("projects/cynoia-4-7b6842cb.webm"),
        fallbackSrc: media("projects/cynoia-4-51563387.mp4"),
        width: 608,
        height: 1080,
      },
      {
        // product-launch-video-rafaa-chawali.webm
        src: media("projects/cynoia-5-2f79c7a4.webm"),
        fallbackSrc: media("projects/cynoia-5-2e74fd79.mp4"),
        width: 608,
        height: 1080,
      },
      {
        // go-to-market-video-strategy-rafaa-chawali.webm
        src: media("projects/cynoia-6-58ed80b5.webm"),
        fallbackSrc: media("projects/cynoia-6-943b165b.mp4"),
        width: 608,
        height: 1080,
      },
      {
        // cover project - launch-video-case-study-rafaa-chawali.webm —
        // same file as coverVideo above, reused rather than re-uploaded.
        src: media("projects/cynoia-dfdef97a.webm"),
        fallbackSrc: media("projects/cynoia-5d7234ac.mp4"),
        width: 1920,
        height: 1080,
      },
    ],
    metrics: [
      { value: "6+", label: "client collaborations across 6 African countries" },
      { value: "20+", label: "videos produced per month" },
    ],
  },
  {
    slug: "fabskill",
    title: "Fabskill",
    description:
      "Creative direction and production for Fabskill's brand campaign, pairing high-end video with a visual identity built to travel across social, web, and paid.",
    coverImage: "/images/projects/fabskill.jpg",
    coverVideo: {
      src: media("projects/fabskill-75cea563.webm"),
      fallbackSrc: media("projects/fabskill-b9021d98.mp4"),
      width: 635,
      height: 1080,
    },
    videos: [
      {
        // "Slush rafaa chawali, marketing.webm"
        src: media("projects/fabskill-2-038e4d47.webm"),
        fallbackSrc: media("projects/fabskill-2-5dc3ea5d.mp4"),
        width: 1080,
        height: 1080,
      },
      {
        // Podcast - Fabverse/growth-marketing-content-strategy-rafaa-chawali.webm
        src: media("projects/fabskill-3-a98f27bf.webm"),
        fallbackSrc: media("projects/fabskill-3-1ec6ec43.mp4"),
        width: 1920,
        height: 1080,
      },
      {
        // Mobile app launch/startup-launch-campaign-rafaa-chawali.mp4
        src: media("projects/fabskill-4-58731738.mp4"),
        width: 720,
        height: 1280,
      },
      {
        // Mobile app launch/creative-direction-brand-video-rafaa-chawali.mp4
        src: media("projects/fabskill-5-c870393a.mp4"),
        width: 720,
        height: 1280,
      },
      {
        // Mobile app launch/go-to-market-strategy-video-rafaa-chawali.mp4
        src: media("projects/fabskill-6-93593b42.mp4"),
        width: 1280,
        height: 720,
      },
      {
        // Mobile app launch/b2b-saas-content-strategy-rafaa-chawali.mp4
        src: media("projects/fabskill-7-0a74837d.mp4"),
        width: 1920,
        height: 1080,
      },
      {
        // E-learning/Creative direction, video marketing, videos, system design.mp4
        src: media("projects/fabskill-8-c5199a80.mp4"),
        width: 1920,
        height: 1080,
      },
      {
        // E-learning/Le Coach - LinkedIn Booster Workshop.mp4
        src: media("projects/fabskill-9-ab2ed31c.mp4"),
        width: 1920,
        height: 1080,
      },
      {
        // E-learning/Yasmine olympics, rafaa chawali, marketing digital, gtm, go to market.mp4
        src: media("projects/fabskill-10-4fe4f21e.mp4"),
        width: 1280,
        height: 720,
      },
      {
        // Cover project - video-marketing-case-study-rafaa-chawali.webm —
        // same file as coverVideo above, reused rather than re-uploaded.
        src: media("projects/fabskill-75cea563.webm"),
        fallbackSrc: media("projects/fabskill-b9021d98.mp4"),
        width: 635,
        height: 1080,
      },
    ],
    metrics: [
      { value: "+420%", label: "user acquisition (B2C)" },
      { value: "+50%", label: "growth in B2B lead generation" },
      { value: "6M+", label: "engagement across all platforms" },
    ],
  },
  {
    slug: "spectra-la-rose",
    title: "Spectra La Rose",
    description:
      "Campaign concept, shoot, and post for Spectra La Rose — a product showcase built to make a new launch feel unmistakably premium.",
    coverImage: "/images/projects/spectra-la-rose.jpg",
    coverVideo: {
      src: media("projects/spectra-la-rose-a048d7e6.mp4"),
      width: 720,
      height: 1280,
    },
    videos: [
      {
        // "creative direction rafaa chawali, video marketing, videos,
        // simple, marketing agency tunis.mp4"
        src: media("projects/spectra-la-rose-2-7c406ef1.mp4"),
        width: 720,
        height: 1280,
      },
      {
        // Cover Project - SPECTRA LA ROSE...mp4 — same file as coverVideo
        // above, reused rather than re-uploaded.
        src: media("projects/spectra-la-rose-a048d7e6.mp4"),
        width: 720,
        height: 1280,
      },
    ],
    metrics: [{ value: "+400k", label: "views" }],
  },
  {
    slug: "jam-music-academy",
    title: "Jam Music Academy",
    description:
      "An ongoing content roadmap for Jam Music Academy, turning everyday studio moments into a steady stream of social-first video.",
    coverImage: "/images/projects/jam-music-academy.jpg",
    coverVideo: {
      src: media("projects/jam-music-academy-65d8b96f.webm"),
      fallbackSrc: media("projects/jam-music-academy-39f07901.mp4"),
      width: 608,
      height: 1080,
    },
    videos: [
      {
        // launch-campaign-strategy-rafaa-chawali.webm — horizontal
        src: media("projects/jam-music-academy-2-7fa0232e.webm"),
        fallbackSrc: media("projects/jam-music-academy-2-1120e920.mp4"),
        width: 1278,
        height: 720,
      },
      {
        // founder-led-launch-video-rafaa-chawali.webm — vertical
        src: media("projects/jam-music-academy-3-896a7acc.webm"),
        fallbackSrc: media("projects/jam-music-academy-3-bbd9b15d.mp4"),
        width: 608,
        height: 1080,
      },
      {
        // Cover Project - launch-video-case-study-rafaa-chawali.webm —
        // same file as coverVideo above, reused rather than re-uploaded.
        src: media("projects/jam-music-academy-65d8b96f.webm"),
        fallbackSrc: media("projects/jam-music-academy-39f07901.mp4"),
        width: 608,
        height: 1080,
      },
    ],
    metrics: [{ value: "30+", label: "students enrolled at launch" }],
  },
  {
    slug: "oakley-x-cactus-jack",
    title: "Oakley x Cactus Jack",
    description:
      "Event coverage and an aftermovie for the Oakley x Cactus Jack collaboration, cut for pace and built to spread fast.",
    coverImage: "/images/projects/oakley-x-cactus-jack.jpg",
    coverVideo: {
      src: media("projects/oakley-x-cactus-jack-404a5974.webm"),
      fallbackSrc: media("projects/oakley-x-cactus-jack-7442226c.mp4"),
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
      src: media("projects/radhi-chawali-hide-and-seek-4bed331c.webm"),
      fallbackSrc: media("projects/radhi-chawali-hide-and-seek-6bc70d1d.mp4"),
      width: 608,
      height: 1080,
    },
    videos: [
      {
        // "65k views instagram organic.webm"
        src: media("projects/radhi-chawali-hide-and-seek-2-f6d9ee1e.webm"),
        fallbackSrc: media("projects/radhi-chawali-hide-and-seek-2-cd05f744.mp4"),
        width: 608,
        height: 1080,
      },
      {
        // Cover project (1).webm — same file as coverVideo above, reused
        // rather than re-uploaded.
        src: media("projects/radhi-chawali-hide-and-seek-4bed331c.webm"),
        fallbackSrc: media("projects/radhi-chawali-hide-and-seek-6bc70d1d.mp4"),
        width: 608,
        height: 1080,
      },
    ],
    // NOTE: Figma's copy for the first card here is word-for-word the same
    // as Cynoia's own metric label ("client collaborations across 6
    // African countries") — looks like a copy/paste leftover in the
    // design rather than intentional, but implemented as designed pending
    // a real number/caption for this project.
    metrics: [
      { value: "+500K", label: "client collaborations across 6 African countries" },
      { value: "Sold-out", label: "200+ tickets launch event" },
    ],
  },
];

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}
