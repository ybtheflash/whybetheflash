import React, { useEffect, useState, useRef } from "react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import { useRouter } from "next/router";
import Link from "next/link";
import sparkAnimation from "../../public/lottie/spark.json";

const Custom404 = () => {
  const router = useRouter();
  const [showText, setShowText] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  useEffect(() => {
    const animationCycle = () => {
      if (lottieRef.current) {
        lottieRef.current.play();
        setTimeout(() => {
          setShowText(true);
          setTimeout(() => {
            setShowText(false);
            setTimeout(animationCycle, 100);
          }, 2000);
        }, lottieRef.current.getDuration(false) * 1000);
      }
    };

    animationCycle();
  }, []);

  const buttonStyle = {
    marginTop: "40px",
    padding: "10px 20px",
    fontSize: "1.2rem",
    color: isHovered ? "white" : "black",
    backgroundColor: isHovered ? "black" : "white",
    border: "none",
    textDecoration: "none",
    position: "relative" as const,
    overflow: "hidden",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s, color 0.3s",
  };

  const borderStyle = {
    position: "absolute" as const,
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    border: `2px solid ${isHovered ? "white" : "black"}`,
    boxSizing: "border-box" as const,
    borderRadius: "5px",
    animation: `borderFlow ${isHovered ? "0.5s" : "1s"} linear infinite`,
  };

  return (
    <div
      style={{
        backgroundColor: "black",
        color: "white",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ position: "relative", width: 300, height: 200 }}>
        {!showText && (
          <Lottie
            lottieRef={lottieRef}
            animationData={sparkAnimation}
            loop={false}
            autoplay={false}
            style={{ width: "100%", height: "100%" }}
          />
        )}
        {showText && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
            }}
          >
            <h1 style={{ fontSize: "4rem", margin: "0" }}>404</h1>
            <p style={{ fontSize: "1rem", margin: "10px 0 0 0" }}>
              Page Not Found.
            </p>
          </div>
        )}
      </div>
      <button
        style={buttonStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => router.back()} // Navigate back to the previous page
      >
        Go Back
        <span style={borderStyle}></span>
      </button>
      <Link href="/" passHref>
        <p
          style={{
            fontSize: "1rem",
            margin: "10px 0 0 0",
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          or Go Home maybe?
        </p>
      </Link>
      <style jsx global>{`
        @keyframes borderFlow {
          0% {
            clip-path: inset(0 0 95% 0);
          }
          25% {
            clip-path: inset(0 95% 0 0);
          }
          50% {
            clip-path: inset(95% 0 0 0);
          }
          75% {
            clip-path: inset(0 0 0 95%);
          }
          100% {
            clip-path: inset(0 0 95% 0);
          }
        }
      `}</style>
    </div>
  );
};

export default Custom404;
