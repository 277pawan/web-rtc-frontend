import { motion } from "framer-motion";
import type { TargetAndTransition, Variants } from "framer-motion";
import Lottie from "lottie-react";
import airplaneAnimation from "../../../animation/Airplane Lottie Animation.json";
import streetWalkingFoot from "../../../animation/man walking.json";

export interface CardType {
  content: string;
}

function Card() {
  // Animation variants for smooth and engaging effects
  const floatingAnimation: TargetAndTransition = {
    y: [-30, 30, -30],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut", // Fixed: was "easeIn四大"
    },
  };

  const pulseAnimation: TargetAndTransition = {
    scale: [1, 1.1, 1],
    opacity: [1, 0.7, 1],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.4,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: "easeOut",
      },
    },
  };

  const bounceAnimation: TargetAndTransition = {
    y: [0, -20, 0],
    transition: {
      duration: 1.2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  return (
    <div
      style={{ minWidth: "100vw" }}
      className="min-h-screen w-screen bg-[#0a0a0a] text-white overflow-hidden relative"
    >
      {/* Main Content - Optimized for mobile responsiveness */}
      <div className="flex flex-col lg:flex-row items-center justify-between px-4 sm:px-8 py-10 sm:py-20 relative z-10 min-h-screen">
        <motion.div
          className="w-full lg:w-1/2 space-y-6 sm:space-y-8 pr-0 lg:pr-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
        >
          {/* Buttons section with responsive sizing and positioning */}
          <div className="space-y-4 sm:space-y-6">
            <motion.div
              className="inline-block relative -top-2 sm:-top-4 left-6 sm:left-12"
              variants={itemVariants}
            >
              <motion.span
                className="bg-pink-600 text-white py-4 sm:py-6 px-8 sm:px-14 cursor-pointer rounded-xl text-base sm:text-xl font-semibold inline-block shadow-lg"
                animate={pulseAnimation}
                whileHover={{
                  scale: 1.15,
                  rotate: 3,
                  boxShadow: "0px 0px 20px rgba(236, 72, 153, 0.5)",
                }}
                whileTap={{ scale: 0.95 }}
              >
                Animate Anything
              </motion.span>
            </motion.div>
            <motion.div
              className="inline-block relative top-6 sm:top-12 left-2 sm:left-4"
              variants={itemVariants}
            >
              <motion.span
                className="bg-orange-600 text-white cursor-pointer py-3 sm:py-5 px-6 sm:px-10 rounded-xl text-base sm:text-xl font-semibold inline-block shadow-lg"
                whileHover={{
                  scale: 1.15,
                  rotate: -3,
                  boxShadow: "0px 0px 20px rgba(249, 115, 22, 0.5)",
                }}
                whileTap={{ scale: 0.9 }}
              >
                That's right, Anything Tap Me
              </motion.span>
            </motion.div>
          </div>

          {/* Paragraph with responsive font size and spacing */}
          <motion.p
            className="text-gray-200 text-lg sm:text-2xl leading-relaxed max-w-md sm:max-w-xl relative top-4 sm:top-8"
            variants={itemVariants}
          >
            Whether you're animating UI, SVG, or creating immersive WebGL
            experiences, GSAP has your back. Lottie-react brings your animations
            to life with seamless integration and stunning visuals.
          </motion.p>

          {/* Street Walking Foot Lottie - Optimized for mobile with responsive sizing */}
          <motion.div
            className="flex justify-center items-center mt-6 sm:mt-8"
            animate={bounceAnimation}
          >
            <Lottie
              animationData={streetWalkingFoot}
              loop={true}
              autoplay={true}
              className="h-1/3 w-1/3 sm:h-1/2 sm:w-1/2 max-h-64 max-w-64"
            />
          </motion.div>
        </motion.div>

        {/* Right section with Airplane Lottie - Responsive sizing */}
        <motion.div
          className="w-full lg:w-1/2 flex justify-center items-center mt-8 lg:mt-0"
          animate={floatingAnimation}
        >
          <Lottie
            animationData={airplaneAnimation}
            loop={true}
            autoplay={true}
            className="h-1/2 w-1/2 sm:h-3/4 sm:w-3/4 max-h-96 max-w-96"
          />
        </motion.div>
      </div>
    </div>
  );
}

export default Card;
