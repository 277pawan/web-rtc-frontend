import Lottie from "lottie-react";
import BirdsFlying from "../../../animation/red birds.json";
import Dletter from "../../../animation/Alphabet D 3D rotation Lottie JSON animation.json";

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

      <div className="text-9xl font-extrabold flex flex-wrap items-center">
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
        <span>&nbsp;eo&nbsp;Calling</span>
      </div>

      <div className="text-9xl font-extrabold self-end">Get Connect</div>
    </div>
  );
};

export default Card2;
