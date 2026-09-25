/**
 * Shared motion curves. A long ease-out makes entrances feel like they
 * settle, which reads as cinematic instead of a linear slide.
 */
export const cinematicEase = [0.22, 1, 0.36, 1] as const;

export const fadeRise = {
  hidden: { opacity: 0, y: 28, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: cinematicEase },
  },
};

export const staggerContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.04 },
  },
};
