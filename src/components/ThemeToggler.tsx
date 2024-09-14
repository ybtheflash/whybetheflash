// src/components/ThemeToggler.tsx

import React, { useRef, useEffect } from "react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import themeTogglerAnimation from "../../public/lottie/theme_toggler.json";

interface ThemeTogglerProps {
  isDarkMode: boolean;
  onAnimationComplete: () => void;
}

const ThemeToggler: React.FC<ThemeTogglerProps> = ({
  isDarkMode,
  onAnimationComplete,
}) => {
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  useEffect(() => {
    if (lottieRef.current) {
      if (isDarkMode) {
        lottieRef.current.playSegments([0, 165], true);
      } else {
        lottieRef.current.playSegments([169, 315], true);
      }
    }
  }, [isDarkMode]);

  return (
    <div className="w-64 h-64">
      <Lottie
        lottieRef={lottieRef}
        animationData={themeTogglerAnimation}
        loop={false}
        autoplay={false}
        onComplete={onAnimationComplete}
      />
    </div>
  );
};

export default ThemeToggler;
