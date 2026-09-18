// All site media lives in the Cloudflare R2 bucket "rafaa-media", served
// from this custom domain. Filenames carry a content hash (built by
// raw-assets/_compressed/build.sh, uploaded with a one-year immutable
// Cache-Control), so a replaced file must be uploaded under a new name.
export const MEDIA_BASE = "https://media.rafaachawali.com";

export const media = (path: string) => `${MEDIA_BASE}/${path}`;

// Declaring the codec (not just "video/webm") matters: Safari without AV1
// hardware decode will otherwise pick the WebM, fail to decode it, and never
// fall through to the MP4 source. AV1 Main profile, level 4.0 — covers both
// the 8-bit and 10-bit encodes.
export const AV1_WEBM_TYPE = 'video/webm; codecs="av01.0.08M.08"';

export function videoTypeFor(src: string) {
  const ext = src.split(".").pop()?.split("?")[0]?.toLowerCase();
  return ext === "mp4" ? "video/mp4" : AV1_WEBM_TYPE;
}
