// lib/lenis.tsx
import { useEffect, useState } from "react";
import Lenis from "lenis";

export function useLenis(
  wrapperRef?: React.RefObject<HTMLElement>,
  contentRef?: React.RefObject<HTMLElement>,
) {
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);

  useEffect(() => {
    let lenis: Lenis;
    if (wrapperRef && wrapperRef.current && contentRef && contentRef.current) {
      // Localized horizontal scroll
      lenis = new Lenis({
        lerp: 0.08,
        smoothWheel: true,
        wrapper: wrapperRef.current,
        content: contentRef.current,
        orientation: "horizontal",
        gestureOrientation: "both",
      });
    } else {
      // Global vertical scroll
      lenis = new Lenis({
        lerp: 0.08,
        smoothWheel: true,
      });
    }

    setLenisInstance(lenis);

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      setLenisInstance(null);
    };
  }, [wrapperRef, contentRef]); // Dependencies to re-initialize if refs change

  return lenisInstance;
}
