"use client";

import { motion } from "framer-motion";

const items = [
  "USER INTERFACE (UI)",
  "RESEARCH",
  "4+ YEARS EXPERIENCE",
  "PROBLEM SOLVING",
  "CRITICAL THINKING",
  "COMMUNICATION & COLLABORATION",
];

const MarqueeBanner = () => {
  const content = items.map((item) => `${item}  ✦  `).join("");
  const repeated = content.repeat(4);

  return (
    <div className="bg-primary py-3 overflow-hidden whitespace-nowrap">
      <motion.div
        className="inline-block font-heading font-semibold text-sm text-primary-foreground tracking-wide"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 25,
            ease: "linear",
          },
        }}
      >
        {repeated}
      </motion.div>
    </div>
  );
};

export default MarqueeBanner;
