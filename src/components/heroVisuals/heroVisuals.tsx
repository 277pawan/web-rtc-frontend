import { useRef, useEffect, useState } from "react";
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
  const [isLoaded, setIsLoaded] = useState(false);
  const cardComponents = [Card1, Card2, Card3, Card4, Card5];

  useEffect(() => {
    const scrollWrapper = scrollWrapperRef.current;
    const scrollContent = scrollContentRef.current;

    if (!scrollWrapper || !scrollContent) return;

    // Function to setup the scroll animation
    const setupScrollAnimation = () => {
      // Calculate the total horizontal scroll distance
      const scrollDistance =
        scrollContent.scrollWidth - scrollWrapper.offsetWidth;

      // Only proceed if there's actual content to scroll
      if (scrollDistance <= 0) return;

      // Kill existing ScrollTriggers to avoid conflicts
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

      // Create a GSAP timeline with ScrollTrigger
      gsap.to(scrollContent, {
        x: -scrollDistance,
        ease: "none",
        scrollTrigger: {
          trigger: scrollWrapper,
          pin: true,
          scrub: 1,
          start: "top top",
          end: () => `+=${scrollDistance}`,
          invalidateOnRefresh: true, // Recalculate on window resize
        },
      });
    };

    // Wait for content to load, then setup animation
    const timeoutId = setTimeout(() => {
      setupScrollAnimation();
      setIsLoaded(true);
    }, 100);

    // Also setup on window resize
    const handleResize = () => {
      if (isLoaded) {
        setupScrollAnimation();
      }
    };

    window.addEventListener("resize", handleResize);

    // Clean up function
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", handleResize);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [cardComponents, isLoaded]);

  // Additional effect to handle when images/animations are fully loaded
  useEffect(() => {
    const scrollContent = scrollContentRef.current;
    if (!scrollContent || isLoaded) return;

    // Wait for all images and animations to load
    const images = scrollContent.querySelectorAll("img");
    const promises = Array.from(images).map((img) => {
      if (img.complete) return Promise.resolve();
      return new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve;
      });
    });

    Promise.all(promises).then(() => {
      // Additional delay to ensure Lottie animations are ready
      setTimeout(() => {
        const scrollWrapper = scrollWrapperRef.current;
        if (scrollWrapper && scrollContent) {
          const scrollDistance =
            scrollContent.scrollWidth - scrollWrapper.offsetWidth;

          if (scrollDistance > 0) {
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

            gsap.to(scrollContent, {
              x: -scrollDistance,
              ease: "none",
              scrollTrigger: {
                trigger: scrollWrapper,
                pin: true,
                scrub: 1,
                start: "top top",
                end: () => `+=${scrollDistance}`,
                invalidateOnRefresh: true,
              },
            });
          }
        }
        setIsLoaded(true);
      }, 500);
    });
  }, [isLoaded]);

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
          width: `${cardComponents.length * 100}vw`, // Ensure proper width
        }}
      >
        {cardComponents.map((Card, i) => (
          <div key={i} style={{ minWidth: "100vw", flexShrink: 0 }}>
            <Card />
          </div>
        ))}
      </div>
    </section>
  );
}
