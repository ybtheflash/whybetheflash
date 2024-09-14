// src/components/HeroRunner.tsx
import React, { useEffect, useRef, useState } from "react";

interface HeroRunnerProps {
  isDarkMode: boolean;
}

const HeroRunner: React.FC<HeroRunnerProps> = ({ isDarkMode }) => {
  const flashRef = useRef<HTMLImageElement>(null);
  const [gifNumber, setGifNumber] = useState(1);

  useEffect(() => {
    const animate = () => {
      if (flashRef.current) {
        const screenWidth = window.innerWidth;
        let position = -50; // Start off-screen to the left

        const animation = setInterval(() => {
          position += 5; // Adjust speed by changing this value
          if (flashRef.current) {
            flashRef.current.style.left = `${position}px`;
          }

          if (position > screenWidth) {
            position = -50; // Reset to start when it goes off-screen
            // Change GIF number when resetting position
            setGifNumber((prev) => (prev % 6) + 1);
          }
        }, 1000 / 120); // 120 FPS for smoother animation

        return () => clearInterval(animation);
      }
    };

    const cleanup = animate();
    return cleanup;
  }, []);

  const gifName = `${isDarkMode ? "d" : ""}w${gifNumber}.gif`;

  return (
    <div className="w-full h-[128px] relative overflow-hidden">
      <div
        className="absolute inset-0 bg-repeat-x"
        style={{
          backgroundImage: `url('/images/flash-running/${
            isDarkMode ? "droad-strip.png" : "road-strip.png"
          }')`,
          backgroundSize: "auto 128px", // Keep original aspect ratio, set height to 128px
          backgroundPosition: "bottom",
          width: "100%",
          height: "128px", // Reduced height
        }}
      ></div>
      <img
        ref={flashRef}
        src={`/images/flash-running/${gifName}`}
        alt="The Flash running"
        className="absolute bottom-1 h-24" // Adjusted height to fit new container height
        style={{ left: "-50px" }} // Start off-screen
      />
    </div>
  );
};

export default HeroRunner;
