// src/components/HeroContent.tsx
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

  return (
    <div
      className={`w-full h-screen flex flex-col justify-center items-end pr-16 ${
        isDarkMode ? "text-black" : "text-white"
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
            className="text-5xl font-bold mb-2"
          >
            {currentLang.text}
          </motion.h2>
        </AnimatePresence>
        <h1 className="text-8xl font-extrabold">Yubaraj Biswas</h1>
      </div>
    </div>
  );
};

export default HeroContent;
