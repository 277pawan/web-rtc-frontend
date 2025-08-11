import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Card1, { CardType } from "./components/Card1.tsx";
import "./heroVisuals.css";

gsap.registerPlugin(ScrollTrigger);

export default function HeroVisuals({ cards }: { cards: CardType[] }) {
  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const scrollContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollWrapper = scrollWrapperRef.current;
    const scrollContent = scrollContentRef.current;

    if (!scrollWrapper || !scrollContent) return;

    // Calculate the total horizontal scroll distance
    const scrollDistance =
      scrollContent.scrollWidth - scrollWrapper.offsetWidth;

    // Create a GSAP timeline with ScrollTrigger
    gsap.to(scrollContent, {
      x: -scrollDistance, // Animate the x position to the left
      ease: "none",
      scrollTrigger: {
        trigger: scrollWrapper,
        pin: true,
        scrub: 1,
        // Start the animation when the top of the trigger hits the top of the viewport
        start: "top top",
        // The animation ends after the user scrolls a distance equal to the horizontal content width.
        end: () => `${scrollDistance}`,
      },
    });

    // Clean up function
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [cards]);

  return (
    <section
      ref={scrollWrapperRef}
      style={{
        height: "100vh", // The component's height determines when the scroll starts
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
        }}
      >
        {cards.map((card, i) => (
          <Card1 key={i} content={card.content} />
        ))}
      </div>
    </section>
  );
}
