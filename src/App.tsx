import "./index.css";
import Lobby from "./components/screens/Lobby";
import { Route, Routes } from "react-router-dom";
import Room from "./components/screens/Room";
import Header from "./components/navbar/Header";
import HeroSection from "./components/heroSection/HeroSection";
import { useLayoutEffect, useState } from "react";
import LandingPage from "./components/landing/Landing";
import { AnimatePresence } from "framer-motion";
import Signin from "./components/authentication/Signin";

function App() {
  const [showLanding, setShowLanding] = useState(true);

  useLayoutEffect(() => {
    const timeout = setTimeout(() => {
      setShowLanding(false);
    }, 3500); // should match exit animation time

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="bg-[#0a0a0a] min-h-screen w-screen overflow-y-auto">
      <AnimatePresence mode="wait">
        {showLanding ? (
          <LandingPage key="landing" />
        ) : (
          <div key="main">
            <Header />
            <Routes>
              <Route path="/" element={<HeroSection />} />
              <Route path="/lobby" element={<Lobby />} />
              <Route path="/room/:roomId" element={<Room />} />
              <Route path="/sign-in" element={<Signin />} />
            </Routes>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
