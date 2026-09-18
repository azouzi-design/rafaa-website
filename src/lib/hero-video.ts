import { media } from "@/lib/media";

// Always rendered muted (see HeroVideo.tsx) — the source file's own audio
// track is silent (measured ~-91dB, effectively no signal), so there's
// nothing worth carrying into these derivatives; both were encoded with -an.
export const HERO_VIDEO = {
  webm: media("hero/hero-a634c099.webm"),
  mp4: media("hero/hero-b26f401a.mp4"),
  poster: media("hero/hero-poster-aae5f40d.jpg"),
};

// Background audio, played from its own <audio> element independent of the
// (silent, muted) hero video — Fred again.. feat. The Blessed Madonna,
// "Marea (We've Lost Dancing)".
export const HERO_AUDIO = {
  m4a: media("hero/hero-audio-40b3801d.m4a"),
  webm: media("hero/hero-audio-2d0ff0d5.webm"),
};
