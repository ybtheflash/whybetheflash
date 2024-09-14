import React from "react";
import Lottie from "lottie-react";
import preloaderAnimation from "../../public/lottie/spark.json"; // Adjust the path as needed

interface PreloaderProps {
  isLoading: boolean;
}

const Preloader: React.FC<PreloaderProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  const LightningBolt = () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13 3V10H20L11 21V14H4L13 3Z"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black">
      <div className="w-64 h-64">
        <Lottie
          animationData={preloaderAnimation}
          loop={true}
          autoplay={true}
        />
      </div>
      <div className="flex space-x-4 mt-4">
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className="animate-bounce"
            style={{
              animationDelay: `${index * 0.2}s`,
              animationDuration: "0.8s",
            }}
          >
            <LightningBolt />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Preloader;
