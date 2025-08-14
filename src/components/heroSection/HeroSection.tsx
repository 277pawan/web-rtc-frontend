import VerticalMarquee from "./VeticalMarquee";
import figma from "../../../src/assets/2149328305.jpg";
import coolImage from "../../../src/assets/2149019117.jpg";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const images = [figma, coolImage, figma, coolImage];

function HeroSection() {
  return (
    <section className="relative min-h-[90vh] sm:grid sm:grid-cols-2 sm:items-center overflow-hidden">
      {/* LEFT CONTENT */}
      <div className="p-8 md:p-12 lg:px-16 lg:py-24 z-10">
        <div className="max-w-xl text-center md:text-left ltr:sm:text-left rtl:sm:text-right space-y-6">
          <h2 className="text-3xl font-bold text-background dark:text-foreground">
            Seamless Video Calling: Connect Anytime, Anywhere
          </h2>

          <p className="text-muted-foreground">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Et, egestas
            tempus tellus etiam sed. Quam a scelerisque amet ullamcorper eu enim
            et fermentum, augue.
          </p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Link
              to="/lobby"
              className="inline-block rounded-md bg-primary px-12 py-3 text-sm font-medium text-primary-foreground transition hover:bg-primary-hover focus:ring-3 focus:ring-ring focus:outline-none"
            >
              Get Started Today
            </Link>
          </motion.div>

          {/* Feature Tags */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-wrap justify-center items-center md:justify-start gap-3 mt-4"
          >
            {["High Performance", "Revolutionary", "Progressive"].map(
              (item, idx) => (
                <span
                  key={idx}
                  className="inline-block cursor-pointer rounded-md bg-muted px-4 py-2 text-sm font-medium text-foreground hover:bg-primary hover:text-primary-foreground transition"
                >
                  {item}
                </span>
              ),
            )}
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="grid grid-cols-2 gap-6 mt-6"
          >
            <div>
              <h3 className="text-3xl font-bold text-primary">10K+</h3>
              <p className="text-sm text-muted-foreground">Happy Customers</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-primary">24/7</h3>
              <p className="text-sm text-muted-foreground">Customer Support</p>
            </div>
          </motion.div>

          {/* Testimonial */}
          <motion.blockquote
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="mt-6 italic text-muted-foreground"
          >
            “Truly revolutionary. Best decision we ever made.”
            <footer className="mt-2 text-sm font-medium text-foreground">
              – Perry P.
            </footer>
          </motion.blockquote>
        </div>
      </div>

      {/* VERTICAL MARQUEE */}
      <div className="flex gap-10 justify-center items-center h-full w-full z-0 pointer-events-none">
        <VerticalMarquee images={images} direction="up" />
        <VerticalMarquee images={images} direction="down" />
      </div>
    </section>
  );
}

export default HeroSection;
