// App.tsx
import { motion } from "framer-motion";
import { useLayoutEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import "./index.css";
import Header from "./components/navbar/Header";
import HeroSection from "./components/heroSection/HeroSection";
import FeatHighlighter from "./components/featHighlighter/featHighlighter";
import LandingPage from "./components/landing/Landing";
import Lobby from "./components/screens/Lobby";
import Room from "./components/screens/Room";
import Signin from "./components/authentication/Signin";
import LoginPage from "./components/authentication/Login";
import HeroVisuals from "./components/heroVisuals/heroVisuals";
import { useLenis } from "./lib/lenis";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

function App() {
  // implementing tanstack query
  const queryClient = new QueryClient();

  // Adding Lenis for smooth scroll
  useLenis();
  const [showLanding, setShowLanding] = useState(false);
  const location = useLocation();

  useLayoutEffect(() => {
    const timeout = setTimeout(() => {
      setShowLanding(false);
    }, 3500);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="bg-[#0a0a0a] min-h-[100dvh] w-screen overflow-y-auto">
      {showLanding ? (
        <LandingPage />
      ) : (
        <>
          <QueryClientProvider client={queryClient}>
            <Toaster
              position="top-right"
              richColors
              visibleToasts={4}
              theme="system"
              closeButton
            />
            <Header />
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route
                  path="/"
                  element={
                    <>
                      <HeroSection />
                      <motion.div>
                        <HeroVisuals />
                      </motion.div>
                      <FeatHighlighter />
                    </>
                  }
                />
                <Route path="/lobby" element={<Lobby />} />
                <Route path="/room/:roomId" element={<Room />} />
                <Route path="/sign-in" element={<Signin />} />
                <Route path="/login" element={<LoginPage />} />
              </Routes>
            </AnimatePresence>
          </QueryClientProvider>
        </>
      )}
    </div>
  );
}

export default App;
