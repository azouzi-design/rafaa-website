const BLOB_BASE = "https://nc4bbxof81dtn2uz.public.blob.vercel-storage.com/hero";

// Always rendered muted (see HeroVideo.tsx) — the source file's own audio
// track is silent (measured ~-91dB, effectively no signal), so there's
// nothing worth carrying into these derivatives; both were re-muxed/
// re-encoded with -an.
export const HERO_VIDEO = {
  webm: `${BLOB_BASE}/hero-5pPPAOqfg9yO0js1BulUuT5LnSusuA.webm`,
  mp4: `${BLOB_BASE}/hero-wexuTqyquhQF1DnbbgbaaJVLYqkwJO.mp4`,
  poster: `${BLOB_BASE}/hero-poster-xZrFPftUF3Ro5xcYLeeaNgnyX23Fgc.jpg`,
};

// Background audio, played from its own <audio> element independent of the
// (silent, muted) hero video — Fred again.. feat. The Blessed Madonna,
// "Marea (We've Lost Dancing)".
export const HERO_AUDIO = {
  m4a: `${BLOB_BASE}/hero-audio-QSyTIPdgfXT0ywGv6QkDsoo2xQcWJv.m4a`,
  webm: `${BLOB_BASE}/hero-audio-lEmd5o0SbltvcD6uHR9x94YQ1PCWt0.webm`,
};
