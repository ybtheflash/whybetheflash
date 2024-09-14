import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUser,
  FaProjectDiagram,
  FaShareAlt,
  FaHeart,
  FaInstagram,
  FaLinkedin,
  FaGithub,
  FaCodepen,
  FaDiscord,
  FaTimes,
} from "react-icons/fa";
import Link from "next/link";

interface AboutMeProps {
  isDarkMode: boolean;
}

interface Card {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

const cards: Card[] = [
  {
    id: "bio",
    title: "Bio",
    icon: <FaUser />,
    content: (
      <div>
        <p>
          Hi, I'm Yubaraj Biswas, a passionate web developer with a keen
          interest in creating innovative and user-friendly web applications. I
          love exploring new technologies and pushing the boundaries of what's
          possible on the web.
        </p>
        <br></br>
        <h4 className="font-bold">University Name</h4>
        <p>Bachelor of Technology in Computer Science</p>
        <p>Expected Graduation: 2025</p>
        <h4 className="font-bold mt-4">High School Name</h4>
        <p>Graduated: 2021</p>
      </div>
    ),
  },
  {
    id: "projects",
    title: "Projects",
    icon: <FaProjectDiagram />,
    content: (
      <div>
        <p>
          I've worked on various exciting projects. Here are a few highlights:
        </p>
        <ul className="list-disc list-inside mt-2">
          <li>Project 1: Brief description</li>
          <li>Project 2: Brief description</li>
          <li>Project 3: Brief description</li>
        </ul>
        <Link
          href="/projects"
          className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          View All Projects
        </Link>
      </div>
    ),
  },
  {
    id: "socials",
    title: "Socials",
    icon: <FaShareAlt />,
    content: (
      <div className="flex space-x-4">
        {[
          { icon: <FaInstagram />, url: "https://instagram.com/yourusername" },
          { icon: <FaLinkedin />, url: "https://linkedin.com/in/yourusername" },
          { icon: <FaGithub />, url: "https://github.com/yourusername" },
          { icon: <FaCodepen />, url: "https://codepen.io/yourusername" },
          { icon: <FaDiscord />, url: "https://discord.gg/yourinvite" },
        ].map((social, index) => (
          <motion.a
            key={index}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-3xl text-gray-700 hover:text-blue-500"
            whileHover={{ scale: 1.2, rotate: 5 }}
          >
            {social.icon}
          </motion.a>
        ))}
      </div>
    ),
  },
  {
    id: "hobbies",
    title: "Hobbies",
    icon: <FaHeart />,
    content: (
      <div>
        <p>
          When I'm not coding, you can find me indulging in various hobbies. I
          enjoy photography, playing guitar, and exploring new hiking trails.
        </p>
        <Link
          href="/hobbies"
          className="mt-4 inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
        >
          Explore My Hobbies
        </Link>
      </div>
    ),
  },
];

const AboutMe: React.FC<AboutMeProps> = ({ isDarkMode }) => {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [cardOrder, setCardOrder] = useState(cards.map((card) => card.id));
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (expandedCard) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [expandedCard]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setHoveredCard(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDragEnd = (event: any, info: any, cardId: string) => {
    if (expandedCard) return;
    const draggedDistance = info.offset.x;
    const cardWidth = event.target.offsetWidth;
    const dragThreshold = cardWidth / 2;

    if (Math.abs(draggedDistance) > dragThreshold) {
      const currentIndex = cardOrder.indexOf(cardId);
      const newIndex =
        draggedDistance > 0
          ? Math.min(currentIndex + 1, cardOrder.length - 1)
          : Math.max(currentIndex - 1, 0);

      const newOrder = [...cardOrder];
      newOrder.splice(currentIndex, 1);
      newOrder.splice(newIndex, 0, cardId);
      setCardOrder(newOrder);
    }
  };

  const glowColors = {
    bio: "rgba(255, 105, 180, 0.3)", // Hot pink
    hobbies: "rgba(64, 224, 208, 0.3)", // Turquoise
    projects: "rgba(255, 165, 0, 0.3)", // Orange
    socials: "rgba(50, 205, 50, 0.3)", // Lime green
  };

  return (
    <div
      ref={containerRef}
      className={`w-full min-h-screen ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-900 text-white"
      } p-8 relative`}
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 gap-4">
        {cardOrder.map((id) => {
          const card = cards.find((c) => c.id === id)!;
          return (
            <motion.div
              key={card.id}
              layoutId={card.id}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(event, info) => handleDragEnd(event, info, card.id)}
              onHoverStart={() => setHoveredCard(card.id)}
              onHoverEnd={() => setHoveredCard(null)}
              animate={
                hoveredCard === card.id && !expandedCard
                  ? {
                      scale: 1.05,
                      boxShadow: `0px 0px 15px ${
                        glowColors[card.id as keyof typeof glowColors]
                      }`,
                    }
                  : {
                      scale: 1,
                      boxShadow: "none",
                    }
              }
              className={`bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg p-4 rounded-lg shadow-lg cursor-pointer flex flex-col items-center justify-center text-center h-40 ${
                expandedCard ? "pointer-events-none" : ""
              }`}
              onClick={() => !expandedCard && setExpandedCard(card.id)}
            >
              <div className="text-3xl mb-2">{card.icon}</div>
              <h3 className="text-lg font-semibold">{card.title}</h3>
            </motion.div>
          );
        })}
      </div>
      <AnimatePresence>
        {expandedCard && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-80 z-10"
              onClick={() => setExpandedCard(null)}
            />
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className="fixed top-0 right-0 w-3/4 h-full bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg p-8 shadow-lg flex flex-col z-20"
            >
              <div className="flex-grow overflow-y-auto pr-16">
                <h3 className="text-3xl font-bold mb-4">
                  {cards.find((card) => card.id === expandedCard)?.title}
                </h3>
                {cards.find((card) => card.id === expandedCard)?.content}
              </div>
              <div className="text-8xl self-end mt-4">
                {cards.find((card) => card.id === expandedCard)?.icon}
              </div>
              <div className="absolute bottom-4 left-4 flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={() => setExpandedCard(null)}
                  className="p-2 rounded-full bg-black bg-opacity-50 text-white"
                >
                  <FaTimes />
                </motion.button>
                {cards.map((card) => (
                  <motion.button
                    key={card.id}
                    whileHover={{ scale: 1.1 }}
                    onClick={() => setExpandedCard(card.id)}
                    className={`p-2 rounded-full ${
                      expandedCard === card.id
                        ? "bg-white bg-opacity-50 text-black"
                        : "bg-black bg-opacity-50 text-white"
                    }`}
                  >
                    {card.icon}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AboutMe;
