import React from "react";
import Lottie from "lottie-react";
import preloaderAnimation from "../../public/lottie/loader.json"; // Adjust the path as needed

interface PreloaderProps {
  isLoading: boolean;
}

const Preloader: React.FC<PreloaderProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900">
      <div className="w-64 h-64">
        <Lottie
          animationData={preloaderAnimation}
          loop={true}
          autoplay={true}
        />
      </div>
    </div>
  );
};

export default Preloader;
