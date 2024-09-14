import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { NextPage } from "next";

// Import your components
import HeroRunner from "../components/HeroRunner";
import HeroContent from "../components/HeroContent";
import AboutMe from "../components/AboutMe";
import NavScroll from "../components/Navscroll";

gsap.registerPlugin(ScrollTrigger);

const Home: NextPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check localStorage for saved preference
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode !== null) {
      setIsDarkMode(savedDarkMode === "true");
    }

    // GSAP ScrollTrigger setup
    if (mainRef.current) {
      const sections = gsap.utils.toArray<HTMLElement>(
        mainRef.current.children
      );

      sections.forEach((section, i) => {
        ScrollTrigger.create({
          trigger: section,
          start: "top center",
          end: "bottom center",
          toggleClass: { targets: section, className: "active" },
        });
      });
    }
  }, []);

  const toggleDarkMode = (value: boolean) => {
    setIsDarkMode(value);
    // You can add any additional logic here if needed
  };

  return (
    <>
      <Head>
        <title>Yubaraj Biswas | Web Developer</title>
        <meta
          name="description"
          content="Portfolio of Yubaraj Biswas, Web Developer"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <NavScroll isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />

      <main
        ref={mainRef}
        className={`min-h-screen ${
          isDarkMode ? "bg-black text-white" : "bg-white text-gray-800"
        } transition-colors duration-300`}
      >
        <section id="hero" className="min-h-screen relative overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute w-full h-full object-cover"
          >
            <source src="/videos/hero-bg.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-filter backdrop-blur-md"></div>
          <div className="relative z-10 w-full h-full flex items-center justify-end">
            <HeroContent isDarkMode={isDarkMode} />
          </div>
        </section>
        <section id="hero-runner" className="w-full">
          <HeroRunner isDarkMode={isDarkMode} />
        </section>
        <section
          id="bio"
          className="min-h-screen flex items-center justify-center"
        >
          <AboutMe isDarkMode={isDarkMode} />
        </section>
        {/* <section
          id="what-i-do"
          className="min-h-screen flex items-center justify-center"
        >
          <WhatIDo isDarkMode={isDarkMode} />
        </section>

        <section
          id="dev-stack"
          className="min-h-screen flex items-center justify-center"
        >
          <DevStack isDarkMode={isDarkMode} />
        </section>

        <section
          id="personal-stack"
          className="min-h-screen flex items-center justify-center"
        >
          <PersonalStack isDarkMode={isDarkMode} />
        </section>

        <section
          id="just-beginning"
          className="min-h-screen flex items-center justify-center"
        >
          <JustTheBeginning isDarkMode={isDarkMode} />
        </section> */}
      </main>
    </>
  );
};

export default Home;
