"use client";

import { useEffect, useRef, useState } from "react";
import { HERO_VIDEO, HERO_AUDIO } from "@/lib/hero-video";

export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [soundOn, setSoundOn] = useState(false);

  // Video: always muted — the new hero video's own audio track is silent
  // (see hero-video.ts), and separately, background sound now comes from
  // its own independent <audio> element below, not the video. Plays
  // continuously while both true: the tab is visible, and this section is
  // actually on screen — scrolling away pauses it, same as switching tabs.
  useEffect(() => {
    const video = videoRef.current;
    const root = rootRef.current;
    if (!video || !root) return;

    const tabHiddenRef = { current: false };
    const outOfViewRef = { current: false };

    const sync = () => {
      const shouldPlay = !tabHiddenRef.current && !outOfViewRef.current;
      if (shouldPlay) video.play().catch(() => {});
      else video.pause();
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

    const onPause = () => {
      if (!tabHiddenRef.current && !outOfViewRef.current) video.play().catch(() => {});
    };
    video.addEventListener("pause", onPause);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      observer.disconnect();
      video.removeEventListener("pause", onPause);
    };
  }, []);

  // Audio: independent of scroll position — it's ambient background sound
  // for the whole visit, so it keeps playing wherever the user has
  // scrolled to, only stopping when the tab itself isn't visible. First
  // attempt unmuted (rare browsers allow it); if that's blocked, stay
  // paused rather than looping silently — a muted loop would still
  // download the whole track for visitors who never turn sound on. The
  // unmute button (a real gesture) then starts it.
  const shouldPlayRef = useRef(false);
  const hasAttemptedUnmutedRef = useRef(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const attemptPlay = () => {
      if (!hasAttemptedUnmutedRef.current) {
        hasAttemptedUnmutedRef.current = true;
        audio.muted = false;
        audio
          .play()
          .then(() => setSoundOn(true))
          .catch(() => {
            audio.muted = true;
            setSoundOn(false);
          });
        return;
      }
      if (!audio.muted) audio.play().catch(() => {});
    };

    const sync = () => {
      const desired = document.visibilityState === "visible";
      shouldPlayRef.current = desired;
      if (desired) attemptPlay();
      else audio.pause();
    };
    sync();

    const onVisibilityChange = () => sync();
    document.addEventListener("visibilitychange", onVisibilityChange);

    const onPause = () => {
      if (shouldPlayRef.current && !audio.muted) audio.play().catch(() => {});
    };
    audio.addEventListener("pause", onPause);

    const onInteraction = () => {
      if (shouldPlayRef.current && !audio.muted && audio.paused) audio.play().catch(() => {});
    };
    window.addEventListener("pointerdown", onInteraction);
    window.addEventListener("keydown", onInteraction);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      audio.removeEventListener("pause", onPause);
      window.removeEventListener("pointerdown", onInteraction);
      window.removeEventListener("keydown", onInteraction);
    };
  }, []);

  const toggleSound = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const next = !soundOn;
    audio.muted = !next;
    setSoundOn(next);
    // Click is a real user gesture, so unmuted playback is always allowed
    // here. Muting pauses outright — no point streaming a silent loop.
    if (next) audio.play().catch(() => {});
    else audio.pause();
  };

  return (
    <div ref={rootRef} className="relative h-screen w-full overflow-hidden bg-black">
      <video
        ref={videoRef}
        loop
        muted
        playsInline
        preload="auto"
        poster={HERO_VIDEO.poster}
        className="absolute inset-0 h-full w-full object-cover opacity-[85%]"
        disablePictureInPicture
        onContextMenu={(e) => e.preventDefault()}
      >
        <source src={HERO_VIDEO.webm} type="video/webm" />
        <source src={HERO_VIDEO.mp4} type="video/mp4" />
      </video>

      <audio ref={audioRef} loop preload="none">
        <source src={HERO_AUDIO.webm} type="audio/webm" />
        <source src={HERO_AUDIO.m4a} type="audio/mp4" />
      </audio>

      {/* `fixed` (not `absolute`) so it stays put on screen through the
          whole homepage scroll instead of scrolling away with Hero — it
          controls the background audio for the entire visit, so it needs
          to stay reachable everywhere. */}
      <button
        type="button"
        onClick={toggleSound}
        aria-label={soundOn ? "Mute background audio" : "Unmute background audio"}
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
