import React, { useState, useRef, useEffect, useCallback } from "react";
import lottie from "lottie-web";
import styles from "../styles/MusicWidget.module.scss";
import * as mmb from "music-metadata-browser";

interface MusicWidgetProps {
  hasClicked: boolean;
}

interface TrackMetadata {
  Name: string;
  Artist: string;
}

//TOTAL TRACK COUNTS
const TOTAL_TRACKS = 3;

const MusicWidget: React.FC<MusicWidgetProps> = ({ hasClicked }) => {
  const [currentTrack, setCurrentTrack] = useState(1);
  const [accentColor, setAccentColor] = useState("rgba(255, 255, 255, 0.2)");
  const [trackInfo, setTrackInfo] = useState<TrackMetadata>({
    Name: "Cooking...",
    Artist: "Cooking...",
  });
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const [useDarkVisualization, setUseDarkVisualization] = useState(false);
  const [isFadingIn, setIsFadingIn] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const widgetRef = useRef<HTMLDivElement | null>(null);
  const lottieRef = useRef<HTMLDivElement | null>(null);
  const lottieAnimationRef = useRef<any>(null);

  const getJsDelivrUrl = (trackNumber: number) => {
    return `https://cdn.jsdelivr.net/gh/ybtheflash/ybtheflash@main/audio/songs/${trackNumber}/song.m4a`;
  };

  const fadeInVolume = useCallback(() => {
    if (!audioRef.current) return;

    setIsFadingIn(true);
    let vol = 0;
    const targetVolume = 0.2;
    const stepDuration = 300; // 50ms per step, total 100ms

    const fadeInterval = setInterval(() => {
      if (vol < targetVolume) {
        vol += 0.01;
        if (audioRef.current) {
          audioRef.current.volume = vol;
          setVolume(vol);
        }
      } else {
        clearInterval(fadeInterval);
        if (audioRef.current) {
          audioRef.current.volume = targetVolume;
          setVolume(targetVolume);
        }
        setIsFadingIn(false);
      }
    }, stepDuration);
  }, []);

  const loadTrack = useCallback(
    async (trackNumber: number) => {
      if (!audioRef.current) return;

      const url = getJsDelivrUrl(trackNumber);
      audioRef.current.src = url;
      audioRef.current.load();

      try {
        const metadata = await mmb.fetchFromUrl(url);
        const title = metadata.common.title || `Track ${trackNumber}`;
        const artist = metadata.common.artist || `Artist ${trackNumber}`;

        setTrackInfo({
          Name: title,
          Artist: artist,
        });
      } catch (error) {
        console.error("Error fetching metadata:", error);
        setTrackInfo({
          Name: `Track ${trackNumber}`,
          Artist: `Artist ${trackNumber}`,
        });
      }

      if (userInteracted) {
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch(console.error);
      }
    },
    [userInteracted]
  );

  const changeTrack = useCallback((direction: "next" | "prev") => {
    setCurrentTrack((prev) =>
      direction === "next"
        ? (prev % TOTAL_TRACKS) + 1
        : ((prev - 2 + TOTAL_TRACKS) % TOTAL_TRACKS) + 1
    );
  }, []);

  const togglePlay = useCallback(() => {
    if (!userInteracted) {
      setUserInteracted(true);
    }

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        if (!userInteracted) {
          fadeInVolume();
        }
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch(console.error);
      }
    }
  }, [isPlaying, userInteracted, fadeInVolume]);

  const handleVolumeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newVolume = parseFloat(e.target.value);
      setVolume(newVolume);
      if (audioRef.current) {
        audioRef.current.volume = newVolume;
      }
    },
    []
  );

  const seekAudio = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseFloat(e.target.value);
    setProgress(newProgress);
    setIsSeeking(true);

    if (audioRef.current && !isNaN(audioRef.current.duration)) {
      const newTime = (newProgress / 100) * audioRef.current.duration;
      if (isFinite(newTime)) {
        audioRef.current.currentTime = newTime;
      }
    }
  }, []);

  const handleSeekEnd = useCallback(() => {
    setIsSeeking(false);
  }, []);

  const getAccentColor = useCallback((trackNumber: number) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = `https://cdn.jsdelivr.net/gh/ybtheflash/ybtheflash@main/audio/songs/${trackNumber}/img.jpeg`;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (ctx) {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        let r = 0,
          g = 0,
          b = 0;
        for (let i = 0; i < data.length; i += 4) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
        }
        r = Math.floor(r / (data.length / 4));
        g = Math.floor(g / (data.length / 4));
        b = Math.floor(b / (data.length / 4));
        setAccentColor(`rgba(${r}, ${g}, ${b}, 0.6)`);

        // Determine if the color is light
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        setUseDarkVisualization(brightness > 128);
      }
    };
  }, []);

  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = volume;
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (hasClicked && !userInteracted) {
      setUserInteracted(true);
      if (audioRef.current) {
        fadeInVolume();
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch(console.error);
      }
    }
  }, [hasClicked, userInteracted, fadeInVolume]);

  useEffect(() => {
    loadTrack(currentTrack);
    getAccentColor(currentTrack);
  }, [currentTrack, loadTrack, getAccentColor]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      if (!isSeeking) {
        const calculatedProgress = (audio.currentTime / audio.duration) * 100;
        setProgress(isNaN(calculatedProgress) ? 0 : calculatedProgress);
      }
    };

    const handleEnded = () => changeTrack("next");

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [changeTrack, isSeeking]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (widgetRef.current) {
        const rect = widgetRef.current.getBoundingClientRect();
        const isHovering =
          event.clientX >= rect.left &&
          event.clientX <= rect.right &&
          event.clientY >= rect.top &&
          event.clientY <= rect.bottom;
        setIsMinimized(!isHovering);
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    setTimeout(() => setIsMinimized(true), 3000);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      if (lottieAnimationRef.current) {
        lottieAnimationRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (isMinimized) {
      console.log("useDarkVisualization:", useDarkVisualization);
      if (!lottieAnimationRef.current) {
        const path = useDarkVisualization
          ? "https://raw.githubusercontent.com/ybtheflash/el_database_data/main/visualise-dark.json"
          : "https://raw.githubusercontent.com/ybtheflash/el_database_data/main/visualise.json";
        console.log("Loading Lottie animation from:", path);
        lottieAnimationRef.current = lottie.loadAnimation({
          container: lottieRef.current!,
          renderer: "svg",
          loop: true,
          autoplay: false,
          path: path,
        });
      }

      if (isPlaying) {
        lottieAnimationRef.current.play();
      } else {
        lottieAnimationRef.current.pause();
      }
    } else if (!isMinimized && lottieAnimationRef.current) {
      lottieAnimationRef.current.destroy();
      lottieAnimationRef.current = null;
    }
  }, [isMinimized, isPlaying, useDarkVisualization]);

  return (
    <div
      ref={widgetRef}
      className={`${styles["music-widget"]} ${
        isMinimized ? styles["minimized"] : ""
      }`}
      style={{ "--accent-color": accentColor } as React.CSSProperties}
    >
      <img
        className={styles["album-art"]}
        src={`https://cdn.jsdelivr.net/gh/ybtheflash/ybtheflash@main/audio/songs/${currentTrack}/img.jpeg`}
        alt="Album Art"
      />
      <div ref={lottieRef} className={styles["lottie-animation"]}></div>
      {!isMinimized && (
        <div className={styles["content"]}>
          <div className={styles["info"]}>
            <p className={styles["song-title"]}>{trackInfo.Name}</p>
            <p className={styles["artist"]}>{trackInfo.Artist}</p>
          </div>
          <div className={styles["controls"]}>
            <button
              className={styles["control-btn"]}
              onClick={() => changeTrack("prev")}
            >
              <svg viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M6,18V6H8V18H6M9.5,12L18,6V18L9.5,12Z"
                />
              </svg>
            </button>
            <button
              onClick={togglePlay}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              {isPlaying ? (
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path fill="white" d="M14,19H18V5H14M6,19H10V5H6V19Z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path fill="white" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
                </svg>
              )}
            </button>
            <button
              className={styles["control-btn"]}
              onClick={() => changeTrack("next")}
            >
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="white" d="M16,18H18V6H16M6,18L14.5,12L6,6V18Z" />
              </svg>
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              disabled={isFadingIn}
              className={`${styles["volume-bar"]} ${
                isFadingIn ? styles["pulsing"] : ""
              }`}
            />
          </div>
          <div className={styles["progress-bar-container"]}>
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              className={styles["progress-bar"]}
              onChange={seekAudio}
              onMouseUp={handleSeekEnd}
              onTouchEnd={handleSeekEnd}
              style={{ "--progress": `${progress}%` } as React.CSSProperties}
            />
          </div>
        </div>
      )}
      {isMinimized && (
        <>
          <div className={styles["mini-progress"]}>
            <div
              className={`${styles["mini-progress-inner"]} ${
                useDarkVisualization ? styles["mini-progress-inner-light"] : ""
              }`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className={styles["mini-progress-border"]}></div>
        </>
      )}
    </div>
  );
};

export default MusicWidget;
