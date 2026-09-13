"use client";

import { useEffect, useRef, useState } from "react";
import type { ProjectVideo } from "@/lib/projects";

function mimeTypeFor(src: string) {
  const ext = src.split(".").pop()?.split("?")[0]?.toLowerCase();
  return ext === "mp4" ? "video/mp4" : "video/webm";
}

// One full-viewport-height section per video, the video itself "contain"-
// fit within a box inset 48px on every side — regardless of orientation,
// so a wide horizontal clip and a tall vertical one both just sit centered
// within the same margins instead of each only getting margins on two
// sides. `aspect-ratio` + width/height:auto + both max- constraints is what
// lets the browser pick whichever dimension is limiting, per video,
// without any orientation-specific branching.
function VideoSection({ video }: { video: ProjectVideo }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const rootRef = useRef<HTMLElement>(null);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);

  // Same play-when-visible, pause-when-tab-hidden-or-scrolled-away
  // treatment as HeroVideo — with several of these on one page, only the
  // one actually on screen should ever be decoding.
  useEffect(() => {
    const el = videoRef.current;
    const root = rootRef.current;
    if (!el || !root) return;

    const tabHiddenRef = { current: false };
    const outOfViewRef = { current: false };
    const sync = () => {
      const shouldPlay = !tabHiddenRef.current && !outOfViewRef.current;
      if (shouldPlay) el.play().catch(() => {});
      else el.pause();
    };

    const onVisibilityChange = () => {
      tabHiddenRef.current = document.visibilityState !== "visible";
      sync();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    onVisibilityChange();

    const observer = new IntersectionObserver(
      ([entry]) => {
        outOfViewRef.current = !entry.isIntersecting;
        sync();
      },
      { threshold: 0 },
    );
    observer.observe(root);

    const onTimeUpdate = () => {
      if (el.duration) setProgress(el.currentTime / el.duration);
    };
    el.addEventListener("timeupdate", onTimeUpdate);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      observer.disconnect();
      el.removeEventListener("timeupdate", onTimeUpdate);
    };
  }, []);

  const toggleMute = () => {
    const el = videoRef.current;
    if (!el) return;
    const next = !muted;
    el.muted = next;
    setMuted(next);
    // Click is a real user gesture, so unmuted playback is always allowed here.
    el.play().catch(() => {});
  };

  return (
    <section
      ref={rootRef}
      className="relative flex h-screen w-full snap-start items-center justify-center overflow-hidden bg-black"
    >
      <div
        className="relative overflow-hidden rounded-[2px]"
        style={{
          aspectRatio: `${video.width} / ${video.height}`,
          maxWidth: "calc(100vw - 96px)",
          maxHeight: "calc(100vh - 96px)",
          width: "auto",
          height: "auto",
        }}
      >
        <video
          ref={videoRef}
          muted={muted}
          autoPlay
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
          onContextMenu={(e) => e.preventDefault()}
          className="h-full w-full object-cover"
        >
          <source src={video.src} type={mimeTypeFor(video.src)} />
        </video>

        {/* Progress */}
        <div className="absolute inset-x-0 bottom-0 h-[3px] bg-white/20">
          <div
            className="h-full bg-primary"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        {/* Mute/unmute this video's own sound — independent of the (always
            muted) hero video and of every other video on this page. */}
        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? "Unmute video" : "Mute video"}
          aria-pressed={!muted}
          className="absolute right-4 bottom-4 flex h-10 items-center gap-2 rounded-full bg-black/40 px-5 text-white backdrop-blur-sm transition hover:bg-black/60"
        >
          {muted ? (
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 shrink-0">
              <path
                d="M20.998 1.65601L8.99805 5.25601V15.4714C8.39077 15.1669 7.69806 15 6.99805 15C4.96737 15 2.99805 16.4041 2.99805 18.5C2.99805 20.596 4.96737 22 6.99805 22C9.02873 22 10.998 20.596 10.998 18.5V6.74407L18.998 4.34407V12.4714C18.3908 12.1669 17.6981 12 16.998 12C14.9674 12 12.998 13.4041 12.998 15.5C12.998 17.596 14.9674 19 16.998 19C19.0287 19 20.998 17.596 20.998 15.5V1.65601Z"
                fill="currentColor"
              />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 shrink-0">
              <path
                d="M4.00015 21.4144L21.4144 4.00015L20.0002 2.58594L17 5.58609V3.07129L9.74656 7.00023H5V17.0002H5.58585L2.58594 20.0002L4.00015 21.4144Z"
                fill="currentColor"
              />
              <path
                d="M17 20.9292L10.7173 17.5261L17 11.2434V20.9292Z"
                fill="currentColor"
              />
            </svg>
          )}
          <span className="text-paragraph">{muted ? "Unmute" : "Mute"}</span>
        </button>
      </div>
    </section>
  );
}

export default function ProjectVideoShowcase({
  videos,
}: {
  videos: ProjectVideo[] | undefined;
}) {
  if (!videos?.length) return null;
  return (
    <>
      {videos.map((video, i) => (
        <VideoSection key={`${video.src}-${i}`} video={video} />
      ))}
    </>
  );
}
