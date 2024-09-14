// src/components/HeroContent.tsx
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown } from "react-icons/fa";

interface HeroContentProps {
  isDarkMode: boolean;
}

const flutterLanguages = [
  { code: "ru", text: "Я" },
  { code: "it", text: "Io sono" },
  { code: "zh", text: "我是" },
  { code: "fr", text: "Je suis" },
  { code: "es", text: "Yo soy" },
  { code: "de", text: "Ich bin" },
  { code: "ar", text: "أنا" },
  { code: "ko", text: "나는" },
  { code: "pt", text: "Eu sou" },
  { code: "nl", text: "Ik ben" },
  { code: "sv", text: "Jag är" },
  { code: "pl", text: "Jestem" },
  { code: "tr", text: "Ben" },
  { code: "da", text: "Jeg er" },
  { code: "fi", text: "Minä olen" },
  { code: "no", text: "Jeg er" },
  { code: "cs", text: "Já jsem" },
  { code: "el", text: "Είμαι" },
  { code: "he", text: "אני" },
  { code: "hu", text: "Én vagyok" },
  { code: "ro", text: "Eu sunt" },
  { code: "th", text: "ฉันคือ" },
  { code: "vi", text: "Tôi là" },
  { code: "id", text: "Saya adalah" },
  { code: "ms", text: "Saya adalah" },
  { code: "fil", text: "Ako ay" },
  { code: "uk", text: "Я" },
  { code: "sr", text: "Ја сам" },
  { code: "sk", text: "Ja som" },
  { code: "lt", text: "Aš esu" },
  { code: "lv", text: "Es esmu" },
  { code: "et", text: "Ma olen" },
  { code: "sl", text: "Jaz sem" },
  { code: "bg", text: "Аз съм" },
  { code: "hr", text: "Ja sam" },
  { code: "sw", text: "Mimi ni" },
];

const pauseLanguages = [
  { code: "en", text: "I am" },
  { code: "bn", text: "আমি" },
  { code: "hi", text: "मैं हूँ" },
  { code: "ja", text: "私は" },
];

const useLanguageRotation = () => {
  const [currentLang, setCurrentLang] = useState(flutterLanguages[0]);
  const [isFluttering, setIsFluttering] = useState(true);
  const [pauseIndex, setPauseIndex] = useState(0);

  const flutter = useCallback(() => {
    setIsFluttering(true);
    let flutterIndex = 0;

    const flutterInterval = setInterval(() => {
      setCurrentLang(flutterLanguages[flutterIndex % flutterLanguages.length]);
      flutterIndex++;

      if (flutterIndex >= flutterLanguages.length * 1) {
        clearInterval(flutterInterval);
        setIsFluttering(false);
        setCurrentLang(pauseLanguages[pauseIndex]);
      }
    }, 50);

    return flutterInterval;
  }, [pauseIndex]);

  useEffect(() => {
    let flutterInterval: NodeJS.Timeout;
    let pauseTimeout: NodeJS.Timeout;

    const startCycle = () => {
      flutterInterval = flutter();

      pauseTimeout = setTimeout(() => {
        clearInterval(flutterInterval);
        setPauseIndex((prevIndex) => (prevIndex + 1) % pauseLanguages.length);
      }, flutterLanguages.length * 2 * 50 + 2000); // Flutter duration + 2s pause
    };

    startCycle();

    return () => {
      clearInterval(flutterInterval);
      clearTimeout(pauseTimeout);
    };
  }, [pauseIndex, flutter]);

  return { currentLang, isFluttering };
};

const HeroContent: React.FC<HeroContentProps> = ({ isDarkMode }) => {
  const { currentLang, isFluttering } = useLanguageRotation();
  const [shouldBounce, setShouldBounce] = useState(false);

  useEffect(() => {
    const bounceInterval = setInterval(() => {
      setShouldBounce(true);
      setTimeout(() => setShouldBounce(false), 1500);
    }, 3000);

    return () => clearInterval(bounceInterval);
  }, []);

  const bounceVariants = {
    bounce: {
      y: [0, -10, 0, -5, 0],
      opacity: [0.3, 1, 1, 1, 0.3],
      transition: {
        duration: 1.5,
        times: [0, 0.2, 0.4, 0.6, 1],
        ease: "easeInOut",
      },
    },
    idle: {
      y: 0,
      opacity: 0.3,
      transition: {
        duration: 0.5,
      },
    },
  };

  const scrollToNextSection = () => {
    const nextSection = document.getElementById("bio");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      className={`w-full h-screen flex flex-col justify-center items-end px-6 sm:px-10 md:px-16 lg:px-20 ${
        isDarkMode ? "text-white" : "text-white"
      }`}
    >
      <div className="text-right">
        <AnimatePresence mode="wait">
          <motion.h2
            key={currentLang.code}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: isFluttering ? 0.1 : 0.2 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold mb-2"
          >
            {currentLang.text}
          </motion.h2>
        </AnimatePresence>
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold">
          Yubaraj Biswas
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-base sm:text-lg md:text-xl lg:text-2xl font-light italic mt-2"
        >
          "Love Above All Else."
        </motion.p>
      </div>
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
        variants={bounceVariants}
        animate={shouldBounce ? "bounce" : "idle"}
        onClick={scrollToNextSection}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <FaChevronDown className="text-white text-2xl" />
      </motion.div>
    </div>
  );
};

export default HeroContent;
