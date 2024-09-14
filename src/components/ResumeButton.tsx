import React, { useState } from "react";
import { FaDownload } from "react-icons/fa";

const ResumeButton = ({ href }) => {
  const [isHovered, setIsHovered] = useState(false);

  const buttonStyle = {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 20px",
    fontSize: "1rem",
    color: isHovered ? "white" : "black",
    backgroundColor: isHovered ? "black" : "white",
    border: "none",
    textDecoration: "none",
    position: "relative",
    overflow: "hidden",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s, color 0.3s",
  };

  const borderStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    border: `2px solid ${isHovered ? "white" : "black"}`,
    boxSizing: "border-box",
    borderRadius: "5px",
    animation: isHovered ? "borderFlow 0.5s linear infinite" : "none",
  };

  return (
    <>
      <a
        href={href}
        download
        style={buttonStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <FaDownload />
        My Resume
        <span style={borderStyle}></span>
      </a>
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
    </>
  );
};

export default ResumeButton;
