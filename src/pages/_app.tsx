import React, { useState, useEffect, useCallback } from "react";
import type { AppProps } from "next/app";
import Head from "next/head";
import Preloader from "../components/preloader";
import { I18nextProvider } from "react-i18next";
import i18n from "../i18n";
import MusicWidget from "../components/MusicWidget";
import "../styles/globals.css";
import { Analytics } from "@vercel/analytics/react";

function MyApp({ Component, pageProps }: AppProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasClicked, setHasClicked] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  useEffect(() => {
    const video = document.createElement("video");
    video.src = "/videos/hero-bg.mp4"; // Update this path to match your video's location
    video.load();

    video.onloadeddata = () => {
      setIsVideoLoaded(true);
    };

    const timer = setTimeout(() => {
      if (isVideoLoaded) {
        setIsLoading(false);
      }
    }, 3000);

    return () => {
      clearTimeout(timer);
      video.onloadeddata = null;
    };
  }, [isVideoLoaded]);

  const handleFirstClick = useCallback(() => {
    if (!hasClicked) {
      setHasClicked(true);
      // Remove the event listener after the first click
      document.removeEventListener("click", handleFirstClick);
    }
  }, [hasClicked]);

  useEffect(() => {
    if (!isLoading) {
      document.addEventListener("click", handleFirstClick);
    }
    return () => {
      document.removeEventListener("click", handleFirstClick);
    };
  }, [isLoading, handleFirstClick]);

  return (
    <>
      <Head>
        <link rel="icon" href="/images/favicon.png" type="image/png" />
      </Head>
      <Preloader isLoading={isLoading} />
      {!isLoading && (
        <I18nextProvider i18n={i18n}>
          <div style={{ cursor: hasClicked ? "default" : "pointer" }}>
            <Component {...pageProps} />
            <div
              style={{
                position: "fixed",
                left: "200px",
                bottom: "20px",
                zIndex: 1000,
              }}
            >
              <MusicWidget hasClicked={hasClicked} />
            </div>
          </div>
        </I18nextProvider>
      )}
      <Analytics />
    </>
  );
}

export default MyApp;
