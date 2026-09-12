"use client";

import { useEffect, useRef, useState } from "react";
import { HERO_VIDEO } from "@/lib/hero-video";

export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [soundOn, setSoundOn] = useState(false);
  // Whether the video is *supposed* to be playing right now (tab visible) —
  // used to tell an intentional pause (tab hidden) apart from an
  // unintended one (media keys, a stall). It plays continuously for the
  // whole homepage visit regardless of which section is scrolled into
  // view — see the toggle button below, which is `fixed` so it stays
  // reachable the entire time.
  const shouldPlayRef = useRef(false);
  const hasAttemptedUnmutedRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const attemptPlay = () => {
      // First-ever play attempt tries unmuted (browsers that allow it —
      // rare — keep sound on); every later resume just replays as-is.
      if (!hasAttemptedUnmutedRef.current) {
        hasAttemptedUnmutedRef.current = true;
        video.muted = false;
        video
          .play()
          .then(() => setSoundOn(true))
          .catch(() => {
            video.muted = true;
            setSoundOn(false);
            video.play().catch(() => {});
          });
        return;
      }
      video.play().catch(() => {});
    };

    const sync = () => {
      const desired = document.visibilityState === "visible";
      shouldPlayRef.current = desired;
      if (desired) attemptPlay();
      else video.pause();
    };
    sync();

    // Stop when the tab/window isn't visible, resume when it is again.
    const onVisibilityChange = () => sync();
    document.addEventListener("visibilitychange", onVisibilityChange);

    // While it's supposed to be playing, any pause is unintended (OS media
    // keys, a browser intervention, a network stall) — recover from it. A
    // pause we triggered ourselves above is intentional and left alone.
    const onPause = () => {
      if (shouldPlayRef.current) video.play().catch(() => {});
    };
    video.addEventListener("pause", onPause);

    // Last resort: if a resume attempt above still gets policy-blocked,
    // the next interaction anywhere is a real gesture that unblocks it.
    const onInteraction = () => {
      if (shouldPlayRef.current && video.paused) video.play().catch(() => {});
    };
    window.addEventListener("pointerdown", onInteraction);
    window.addEventListener("keydown", onInteraction);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      video.removeEventListener("pause", onPause);
      window.removeEventListener("pointerdown", onInteraction);
      window.removeEventListener("keydown", onInteraction);
    };
  }, []);

  const toggleSound = () => {
    const video = videoRef.current;
    if (!video) return;
    const next = !soundOn;
    video.muted = !next;
    setSoundOn(next);
    // Click is a real user gesture, so unmuted playback is always allowed here.
    video.play().catch(() => {});
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      <video
        ref={videoRef}
        loop
        playsInline
        preload="auto"
        poster={HERO_VIDEO.poster}
        className="absolute inset-0 h-full w-full object-cover opacity-70"
        disablePictureInPicture
        onContextMenu={(e) => e.preventDefault()}
      >
        <source src={HERO_VIDEO.webm} type="video/webm" />
        <source src={HERO_VIDEO.mp4} type="video/mp4" />
      </video>

      {/* `fixed` (not `absolute`) so it stays put on screen through the
          whole homepage scroll instead of scrolling away with Hero — it
          controls playback for the entire visit, so it needs to stay
          reachable everywhere, same as Navbar (hence matching z-50). */}
      <button
        type="button"
        onClick={toggleSound}
        aria-label={soundOn ? "Mute video sound" : "Unmute video sound"}
        aria-pressed={soundOn}
        className="fixed bottom-6 right-6 z-50 flex h-10 items-center gap-2 rounded-full bg-black/40 px-5 text-white backdrop-blur-sm transition hover:bg-black/60"
      >
        {soundOn ? (
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
        ) : (
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 shrink-0">
            <path
              d="M20.998 1.65601L8.99805 5.25601V15.4714C8.39077 15.1669 7.69806 15 6.99805 15C4.96737 15 2.99805 16.4041 2.99805 18.5C2.99805 20.596 4.96737 22 6.99805 22C9.02873 22 10.998 20.596 10.998 18.5V6.74407L18.998 4.34407V12.4714C18.3908 12.1669 17.6981 12 16.998 12C14.9674 12 12.998 13.4041 12.998 15.5C12.998 17.596 14.9674 19 16.998 19C19.0287 19 20.998 17.596 20.998 15.5V1.65601Z"
              fill="currentColor"
            />
          </svg>
        )}
        <span className="text-paragraph">{soundOn ? "Mute" : "Unmute"}</span>
      </button>
    </div>
  );
}
