"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { AiField } from "@/components/motion/AiField";
import { cn } from "cn";

const rings = [
  { inset: "6%", duration: 22, reverse: false },
  { inset: "16%", duration: 16, reverse: true },
  { inset: "28%", duration: 11, reverse: false },
];

/**
 * The homepage mark is the product, not a decoration. Rings orbit at
 * different speeds so the eye always has something to follow, the network
 * sits inside the core so the logo and the background motion are one object,
 * and a slight tilt toward the pointer makes the mark feel responsive
 * instead of a video playing on its own.
 */
export function AiLogo({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const frame = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  function followPointer(event: React.PointerEvent<HTMLDivElement>) {
    if (reduce) return;
    const box = frame.current?.getBoundingClientRect();
    if (!box) return;
    const px = (event.clientX - box.left) / box.width - 0.5;
    const py = (event.clientY - box.top) / box.height - 0.5;
    setTilt({ x: py * -14, y: px * 16 });
  }

  return (
    <div
      ref={frame}
      onPointerMove={followPointer}
      onPointerLeave={() => setTilt({ x: 0, y: 0 })}
      className={cn("relative mx-auto aspect-square w-full max-w-[440px]", className)}
      aria-hidden
    >
      <div className="absolute inset-8 rounded-full bg-mint/25 blur-3xl" />
      <motion.div
        className="relative h-full w-full"
        animate={{ rotateX: tilt.x, rotateY: tilt.y }}
        transition={{ type: "spring", stiffness: 140, damping: 18 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="absolute inset-[18%] overflow-hidden rounded-full border border-white/40 bg-white/30 shadow-2xl">
          <AiField density={22} />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(255,255,255,0.55)_82%)]" />
        </div>

        {rings.map((ring) => (
          <motion.div
            key={ring.inset}
            className="absolute rounded-full border border-mint/80"
            style={{ inset: ring.inset }}
            animate={reduce ? undefined : { rotate: ring.reverse ? -360 : 360 }}
            transition={{ duration: ring.duration, repeat: Infinity, ease: "linear" }}
          >
            <span className="absolute top-0 left-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-link shadow-[0_0_12px_#0365f2]" />
            <span className="absolute bottom-0 left-1/2 size-2 -translate-x-1/2 translate-y-1/2 rounded-full bg-navy shadow-[0_0_12px_#2bd97c]" />
          </motion.div>
        ))}

        <motion.div
          className="absolute top-1/2 left-1/2 grid size-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-navy text-mint shadow-[0_20px_60px_rgba(3,43,65,0.35)]"
          animate={reduce ? undefined : { scale: [1, 1.05, 1] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-3xl font-bold tracking-tight">VI</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
