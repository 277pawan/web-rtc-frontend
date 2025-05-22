import { motion } from "framer-motion";

const VerticalMarquee = ({
  images,
  direction = "up",
}: {
  images: string[];
  direction?: "up" | "down";
}) => {
  const scrollDistance = images.length * 240; // adjust based on image height + gap

  return (
    <div className="overflow-hidden h-[800px] w-[300px] -skew-x-6 perspective-[800px]">
      <motion.div
        className="flex flex-col gap-5"
        animate={{
          y: direction === "up" ? [-scrollDistance, 0] : [0, -scrollDistance],
        }}
        transition={{
          repeat: Infinity,
          repeatType: "loop",
          duration: 14,
          ease: "linear",
        }}
      >
        {[...images, ...images].map((src, idx) => (
          <div
            key={idx}
            className="transform rotate-x-6 transition-transform duration-300 hover:rotate-x-3"
          >
            <img
              src={src}
              alt={`marquee-img-${idx}`}
              width={300}
              height={200}
              className="rounded-xl h-72 w-80 object-cover ring-2 ring-gray-300"
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default VerticalMarquee;
