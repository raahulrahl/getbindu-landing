import { cdnAsset } from "@/lib/cdn";

export const PORT_POSTER = cdnAsset("/home/images/port-poster.webp");

const PORT_SOURCES = [
  ["/videos/rotterdam-port-hero.av1.webm", 'video/webm; codecs="av01.0.05M.08"'],
  ["/videos/rotterdam-port-hero.webm", 'video/webm; codecs="vp9"'],
] as const;

export function loadPortVideo(video: HTMLVideoElement) {
  video.replaceChildren(...PORT_SOURCES.map(([path, type]) => {
    const source = document.createElement("source");
    source.src = cdnAsset(path);
    source.type = type;
    return source;
  }));
  video.muted = true;
  video.preload = "auto";
  video.load();
}
