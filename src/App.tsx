// App.tsx
import { useLayoutEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { AnimatePresence } from "framer-motion"; // If still used elsewhere
import "./index.css";
import Header from "./components/navbar/Header";
import HeroSection from "./components/heroSection/HeroSection";
import FeatHighlighter from "./components/featHighlighter/featHighlighter";
import Cta from "./components/cta/cta";
import Illustration from "./components/illustration/illustration";
import LandingPage from "./components/landing/Landing";
import Lobby from "./components/screens/Lobby";
import Room from "./components/screens/Room";
import Signin from "./components/authentication/Signin";
import LoginPage from "./components/authentication/Login";
import HeroVisuals from "./components/heroVisuals/heroVisuals";
import { useLenis } from "./lib/lenis"; // Your custom hook

function App() {
  useLenis(); // This call provides global vertical smooth scrolling
  const [showLanding, setShowLanding] = useState(false); // Changed to true for initial landing

  const dummyCards = [
    {
      id: 1,
      content: "Card 1 — Welcome to the meeting app",
      image: "https://via.placeholder.com/300x180.png?text=Card+1",
      description: "This is a sample description to simulate card text.",
    },
    {
      id: 2,
      content: "Card 2 — HD Video & Audio",
      image: "https://via.placeholder.com/300x180.png?text=Card+2",
      description: "High-quality streams with low latency.",
    },
    {
      id: 3,
      content: "Card 3 — Screen Sharing",
      image: "https://via.placeholder.com/300x180.png?text=Card+3",
      description: "Easily share your screen with participants.",
    },
    {
      id: 4,
      content: "Card 4 — Live Chat",
      image: "https://via.placeholder.com/300x180.png?text=Card+4",
      description: "Send messages while staying connected on video.",
    },
    {
      id: 5,
      content: "Card 5 — Secure & Encrypted",
      image: "https://via.placeholder.com/300x180.png?text=Card+5",
      description: "End-to-end encryption for your privacy.",
    },
  ];

  useLayoutEffect(() => {
    const timeout = setTimeout(() => {
      setShowLanding(false);
    }, 3500); // should match exit animation time

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="bg-[#0a0a0a] min-h-[100dvh] w-screen overflow-y-auto">
      <AnimatePresence mode="wait">
        {showLanding ? (
          <LandingPage key="landing" />
        ) : (
          <div key="main">
            <Header />
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <HeroSection />
                    {/* <HeroVisuals cards={dummyCards} />{" "} */}
                    {/* Horizontal scrolling here */}
                    {/* <FeatHighlighter /> */}
                    {/* <Cta /> */}
                    {/* <Illustration /> */}
                  </>
                }
              />
              <Route path="/lobby" element={<Lobby />} />
              <Route path="/room/:roomId" element={<Room />} />
              <Route path="/sign-in" element={<Signin />} />
              <Route path="/login" element={<LoginPage />} />
            </Routes>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
