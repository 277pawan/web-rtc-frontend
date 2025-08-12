import Lottie from "lottie-react";
import BirdsFlying from "../../../animation/red birds.json";
import Dletter from "../../../animation/Alphabet D 3D rotation Lottie JSON animation.json";
import SocialMedia from "../../../animation/Social media connection video with a mobile on hand.json";
import RotatingText from "./RotatingText";

const Card2 = () => {
  return (
    <div
      style={{ minWidth: "100vw" }}
      className="min-h-screen w-screen bg-[#0a0a0a] text-white overflow-hidden relative flex flex-col justify-start items-center"
    >
      <Lottie
        animationData={BirdsFlying}
        loop={true}
        autoplay={true}
        className="h-1/2 w-1/2 sm:max-h-screen sm:w-screen max-h-96 max-w-96"
      />

      <div className="text-9xl font-extrabold flex flex-wrap items-center bg-gradient-to-t from-blue-600 to-green-300 bg-clip-text text-transparent ">
        <span>SeemLess&nbsp;Vi&nbsp;</span>
        <Lottie
          animationData={Dletter}
          loop={true}
          autoplay={true}
          style={{
            display: "inline-flex",
            verticalAlign: "middle",
            height: "10rem",
            width: "10rem",
          }}
          className="-mx-16"
        />
        <span>&nbsp;eo&nbsp;Calling:</span>
      </div>

      <div className="flex text-9xl font-extrabold self-end bg-gradient-to-t from-blue-600 to-green-300 bg-clip-text text-transparent">
        Get
        <RotatingText
          texts={["Connect", "Anytime", "Anywhere"]}
          mainClassName="ml-4 px-2 sm:px-2 md:px-3 bg-cyan-300 text-black overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
          staggerFrom={"last"}
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-120%" }}
          staggerDuration={0.025}
          splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
          transition={{ type: "spring", damping: 30, stiffness: 400 }}
          rotationInterval={2000}
        />
      </div>
      <div className="self-start ml-24">
        <Lottie
          animationData={SocialMedia}
          loop={true}
          autoplay={true}
          className="h-96 w-96"
        />
      </div>
    </div>
  );
};

export default Card2;
