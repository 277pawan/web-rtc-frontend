import { motion } from "framer-motion";
export interface CardType {
  content: string;
}

function Card({ content }: { content: string }) {
  // Animation variants
  const floatingAnimation = {
    y: [-20, 20, -20],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  const rotatingAnimation = {
    rotate: [0, 360],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: "linear",
    },
  };

  const pulseAnimation = {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <div
      style={{ minWidth: "100vw" }}
      className="h-screen w-screen bg-black text-white overflow-hidden relative"
    >
      {/* Navigation */}

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row items-center justify-between px-6 py-20 relative z-10">
        <motion.div
          className="lg:w-1/2 space-y-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
        >
          <div className="space-y-4">
            <motion.div
              className="inline-block relative -top-2 left-10"
              variants={itemVariants}
              whileInView="visible"
            >
              <motion.span
                className="bg-pink-500 text-white py-5 px-12 cursor-pointer rounded-lg text-lg font-medium inline-block"
                animate={pulseAnimation}
                whileHover={{ scale: 1.1, rotate: 2 }}
                whileTap={{ scale: 0.9 }}
              >
                Animate Anything
              </motion.span>
            </motion.div>
            <motion.div
              className="inline-block relative top-10 "
              variants={itemVariants}
            >
              <motion.span
                className="bg-orange-500 text-white cursor-pointer py-4 px-8 rounded-lg text-lg font-medium inline-block"
                whileHover={{ scale: 1.1, rotate: -2 }}
                whileTap={{ scale: 0.8 }}
              >
                That's right, Anything Tap Me
              </motion.span>
            </motion.div>
          </div>
          <br />
          <motion.p
            className="text-gray-300 text-xl leading-relaxed max-w-lg"
            variants={itemVariants}
          >
            Whether you're animating UI, SVG or creating immersive WebGL
            experiences, GSAP has your back.
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}

export default Card;
