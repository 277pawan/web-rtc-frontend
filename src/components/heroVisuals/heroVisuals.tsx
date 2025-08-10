// components/heroVisuals/HeroVisuals.tsx
import { useRef, useEffect } from "react";
import { gsap } from "gsap"; // Import GSAP
import { ScrollTrigger } from "gsap/ScrollTrigger"; // Import ScrollTrigger

gsap.registerPlugin(ScrollTrigger); // Register the ScrollTrigger plugin

type CardType = { content: string };

function Card({ content }: { content: string }) {
  return (
    <div
      style={{
        minWidth: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "2rem",
      }}
      className="bg-red-200"
    >
      {content}
    </div>
  );
}

export default function HeroVisuals({ cards }: { cards: CardType[] }) {
  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const scrollContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollWrapperRef.current || !scrollContentRef.current) return;

    const sections = gsap.utils.toArray(scrollContentRef.current.children); // Get all the individual card elements
    const totalWidth = sections.length * window.innerWidth; // Calculate total width needed

    // Create a horizontal scroll animation using GSAP
    const horizontalScrollTween = gsap.to(sections, {
      xPercent: -100 * (sections.length - 1), // Move cards horizontally
      ease: "none", // Linear movement
      scrollTrigger: {
        trigger: scrollWrapperRef.current, // The element that controls the animation
        pin: true, // Pin the wrapper to keep it in place during horizontal scroll
        scrub: 1, // Smoothly link scroll position to animation progress
        start: "top top", // Start when the top of the trigger hits the top of the viewport
        end: `+=${totalWidth}`, // End point for the animation
      },
    });

    return () => {
      horizontalScrollTween.kill(); // Clean up GSAP animation
    };
  }, [cards.length]); // Re-run if the number of cards changes

  return (
    <section
      ref={scrollWrapperRef} // This is the trigger for ScrollTrigger and will be pinned
      style={{
        height: "100vh", // Section takes full viewport height
      }}
      className="horizontal-scroll-section" // Add a class for specific styling
    >
      <div
        ref={scrollContentRef} // Contains the horizontally laid-out cards
        style={{
          display: "flex",
          height: "100%",
          width: `${cards.length * 100}vw`, // Explicit width for horizontal content
        }}
        className="horizontal-scroll-content"
      >
        {cards.map((card, i) => (
          <Card key={i} content={card.content} />
        ))}
      </div>
    </section>
  );
}
