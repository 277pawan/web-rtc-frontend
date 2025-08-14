import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Card1 from "./components/Card1.tsx";
import Card2 from "./components/Card2.tsx";
import Card3 from "./components/Card3.tsx";
import Card4 from "./components/Card4.tsx";
import Card5 from "./components/Card5.tsx";
import "./heroVisuals.css";

gsap.registerPlugin(ScrollTrigger);

export default function HeroVisuals() {
  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const scrollContentRef = useRef<HTMLDivElement>(null);
  const cardComponents = [Card1, Card2, Card3, Card4, Card5];

  useEffect(() => {
    if (!scrollWrapperRef.current || !scrollContentRef.current) return;

    const scrollWrapper = scrollWrapperRef.current;
    const scrollContent = scrollContentRef.current;

    // Calculate scroll distance
    const scrollDistance =
      scrollContent.scrollWidth - scrollWrapper.offsetWidth;

    if (scrollDistance <= 0) return;

    // Create GSAP context
    const ctx = gsap.context(() => {
      // Create animation
      const animation = gsap.to(scrollContent, {
        x: -scrollDistance,
        ease: "none",
        scrollTrigger: {
          trigger: scrollWrapper,
          pin: true,
          scrub: 1,
          start: "top top",
          end: `+=${scrollDistance}`,
          invalidateOnRefresh: true,
        },
      });

      // Ensure ScrollTrigger is refreshed after initial render
      ScrollTrigger.refresh();

      // Return animation for cleanup
      return () => {
        animation.kill(); // Kill the specific animation
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill()); // Kill all ScrollTriggers
      };
    }, scrollWrapperRef);

    return () => {
      ctx.revert(); // Revert GSAP context
    };
  }, []);

  // Handle resize events
  useEffect(() => {
    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section
      ref={scrollWrapperRef}
      style={{
        height: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
      className="horizontal-scroll-container"
    >
      <div
        ref={scrollContentRef}
        style={{
          display: "flex",
          willChange: "transform",
          width: `${cardComponents.length * 100}vw`,
          height: "100%",
        }}
      >
        {cardComponents.map((Card, i) => (
          <div
            key={`card-${i}`}
            style={{
              width: "100vw",
              height: "100%",
              flexShrink: 0,
            }}
          >
            <Card />
          </div>
        ))}
      </div>
    </section>
  );
}
