import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

type CardType = { content: string };

function Card({
  content,
  index,
  total,
  scrollProgress,
}: {
  content: string;
  index: number;
  total: number;
  scrollProgress: MotionValue<number>;
}) {
  // each card animates vertically/scale while it's in its segment of the whole progress
  const start = index / total;
  const center = (index + 0.5) / total;
  const end = (index + 1) / total;

  const y = useTransform(scrollProgress, [start, center, end], [80, 0, -80]);
  const scale = useTransform(
    scrollProgress,
    [start, center, end],
    [0.9, 1, 0.95],
  );

  return (
    <motion.div
      style={{
        y,
        scale,
        minWidth: "100vw", // one card per viewport width
        height: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        boxSizing: "border-box",
      }}
      className="bg-red-200"
    >
      {content}
    </motion.div>
  );
}

export default function HeroVisuals({ cards }: { cards: CardType[] }) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [vw, setVw] = useState(0);

  // track viewport width for pixel translation (keeps mapping robust on resize)
  useEffect(() => {
    const update = () => setVw(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // scroll progress for the whole section (0 -> 1 while the section scrolls)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"], // 0 when top hits top, 1 when bottom hits bottom
  });

  // translate from 0 to -(n-1)*viewportWidth
  const maxTranslate = (cards.length - 1) * vw;
  const x = useTransform(scrollYProgress, [0, 1], [0, -maxTranslate]);

  return (
    <section
      ref={sectionRef}
      style={{
        height: `${cards.length * 100}vh`, // enough vertical space to step through cards
        position: "relative",
      }}
    >
      {/* sticky pin container: fills viewport while the section is active */}
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
        }}
      >
        {/* wide horizontal row that moves by x */}
        <motion.div
          style={{
            display: "flex",
            width: `${cards.length * 100}vw`,
            x,
            height: "100%",
          }}
        >
          {cards.map((card, i) => (
            <Card
              key={i}
              content={card.content}
              index={i}
              total={cards.length}
              scrollProgress={scrollYProgress}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
