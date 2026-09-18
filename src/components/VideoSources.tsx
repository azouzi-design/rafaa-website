import { videoTypeFor } from "@/lib/media";

// <source> list for a video: the primary file (AV1 WebM for most clips),
// then its H.264 MP4 fallback when one exists. Browsers take the first
// source whose type they can actually play.
export default function VideoSources({
  src,
  fallbackSrc,
}: {
  src: string;
  fallbackSrc?: string;
}) {
  return (
    <>
      <source src={src} type={videoTypeFor(src)} />
      {fallbackSrc && <source src={fallbackSrc} type={videoTypeFor(fallbackSrc)} />}
    </>
  );
}
