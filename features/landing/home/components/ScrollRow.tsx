import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { reduceMotion } from "../lib/motion";

export function useScrollRow({ contentKey, stepByViewport = false }: {
  contentKey?: string;
  stepByViewport?: boolean;
} = {}) {
  const row = useRef<HTMLUListElement>(null);
  const [ends, setEnds] = useState({ start: true, end: false });

  useEffect(() => {
    const list = row.current;
    if (!list) return;
    if (contentKey !== undefined) list.scrollLeft = 0;
    const measure = () => {
      const start = list.scrollLeft < 2;
      const end = list.scrollWidth - list.clientWidth - list.scrollLeft < 2;
      setEnds((current) => current.start === start && current.end === end ? current : { start, end });
    };
    measure();
    const resize = new ResizeObserver(measure);
    resize.observe(list);
    list.addEventListener("scroll", measure, { passive: true });
    return () => {
      resize.disconnect();
      list.removeEventListener("scroll", measure);
    };
  }, [contentKey]);

  function step(direction: 1 | -1) {
    const list = row.current;
    const first = list?.firstElementChild;
    if (!list || !first) return;
    const gap = Number.parseFloat(getComputedStyle(list).columnGap) || 0;
    const stride = first.getBoundingClientRect().width + gap;
    const cards = stepByViewport ? Math.max(1, Math.floor((list.clientWidth + gap) / stride)) : 1;
    list.scrollBy({
      left: direction * stride * cards,
      behavior: reduceMotion() ? "auto" : "smooth",
    });
  }

  return { row, ends, step };
}

export function ScrollRowButtons({ control, previous, next }: {
  control: ReturnType<typeof useScrollRow>;
  previous: string;
  next: string;
}) {
  return (
    <div className="row-controls">
      <button type="button" className="btn btn-secondary row-button" aria-label={previous}
        disabled={control.ends.start} onClick={() => control.step(-1)}>
        <ChevronLeft size={16} aria-hidden="true" />
      </button>
      <button type="button" className="btn btn-secondary row-button" aria-label={next}
        disabled={control.ends.end} onClick={() => control.step(1)}>
        <ChevronRight size={16} aria-hidden="true" />
      </button>
    </div>
  );
}
