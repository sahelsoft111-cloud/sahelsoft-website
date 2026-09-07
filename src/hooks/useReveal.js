import { useEffect, useRef, useState } from "react";

/**
 * Reveals an element (or a group of children, via CSS) once it enters the
 * viewport. Returns [ref, inView] — attach `ref` to the element you want to
 * observe, and toggle an "is-visible" class based on `inView`.
 *
 * Respects prefers-reduced-motion: when the user has requested reduced
 * motion, `inView` is true immediately and no observation happens.
 */
export function useReveal(threshold = 0.2) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView];
}
