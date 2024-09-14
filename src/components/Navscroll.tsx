import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaHome,
  FaUser,
  FaCode,
  FaLaptopCode,
  FaHeart,
  FaRocket,
} from "react-icons/fa";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import darkModeAnimation from "../../public/lottie/toggle-mode.json";
import ThemeToggler from "./ThemeToggler";

interface NavItem {
  id: string;
  icon: React.ReactNode;
  label: string;
}

interface NavScrollProps {
  isDarkMode: boolean;
  toggleDarkMode: (value: boolean) => void;
}

const navItems: NavItem[] = [
  { id: "hero", icon: <FaHome />, label: "Home" },
  { id: "bio", icon: <FaUser />, label: "About" },
  // { id: "skills", icon: <FaCode />, label: "Skills" },
  // { id: "projects", icon: <FaLaptopCode />, label: "Projects" },
  // { id: "interests", icon: <FaHeart />, label: "Interests" },
  // { id: "contact", icon: <FaRocket />, label: "Contact" },
];

const NavScroll: React.FC<NavScrollProps> = ({
  isDarkMode,
  toggleDarkMode,
}) => {
  const [activeSection, setActiveSection] = useState("hero");
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [internalDarkMode, setInternalDarkMode] = useState(isDarkMode);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const offset = windowHeight / 2;

      for (const item of navItems) {
        const element = document.getElementById(item.id);
        if (element) {
          const { top, bottom } = element.getBoundingClientRect();
          if (top <= offset && bottom > offset) {
            setActiveSection(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleToggle = () => {
    const newDarkModeState = !internalDarkMode;
    setIsTransitioning(true);
    setInternalDarkMode(newDarkModeState);

    if (lottieRef.current) {
      if (newDarkModeState) {
        lottieRef.current.playSegments([0, 60], true);
      } else {
        lottieRef.current.playSegments([61, 120], true);
      }
    }
  };

  const handleAnimationComplete = () => {
    setIsTransitioning(false);
    toggleDarkMode(internalDarkMode);
    localStorage.setItem("darkMode", internalDarkMode.toString());
  };

  return (
    <>
      <nav
        className={`fixed left-4 md:left-8 top-1/2 transform -translate-y-1/2 z-50 transition-opacity duration-300 ${
          activeSection === "hero" ? "opacity-0 md:opacity-100" : "opacity-100"
        }`}
      >
        <div className="flex flex-col items-center space-y-4 p-3 rounded-full bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg dark:bg-gray-800 dark:bg-opacity-20 shadow-lg">
          <button
            onClick={handleToggle}
            className="w-10 h-10 rounded-full overflow-hidden focus:outline-none"
            aria-label="Toggle dark mode"
          >
            <Lottie
              lottieRef={lottieRef}
              animationData={darkModeAnimation}
              loop={false}
              autoplay={false}
              style={{ width: "100%", height: "100%" }}
            />
          </button>
          {navItems.map((item) => (
            <motion.a
              key={item.id}
              href={`#${item.id}`}
              className={`relative flex items-center justify-center w-10 h-10 rounded-full text-lg transition-all duration-300 ${
                activeSection === item.id
                  ? "bg-white bg-opacity-70 text-gray-800"
                  : "text-white hover:bg-white hover:bg-opacity-30 hover:text-gray-800"
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <span
                className={`z-10 ${
                  activeSection === item.id ? "text-gray-800" : ""
                }`}
              >
                {item.icon}
              </span>
              {activeSection === item.id && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-white opacity-70"
                  layoutId="glow"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="sr-only">{item.label}</span>
            </motion.a>
          ))}
        </div>
      </nav>
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{ backgroundColor: "#e0e8f3" }}
          >
            <ThemeToggler
              isDarkMode={internalDarkMode}
              onAnimationComplete={handleAnimationComplete}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavScroll;
