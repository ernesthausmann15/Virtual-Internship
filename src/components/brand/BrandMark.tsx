"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "cn";

/**
 * The mark is a small orbit so the logo never sits still. The ring rotates
 * and a single node travels with it, echoing the larger AI field behind
 * the hero without competing with the wordmark.
 */
export function BrandMark({
  className,
  light = false,
  compact = false,
}: {
  className?: string;
  light?: boolean;
  compact?: boolean;
}) {
  const reduce = useReducedMotion();

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="relative grid size-11 place-items-center">
        <span className="absolute inset-0 rounded-full bg-mint/40 blur-md" />
        <motion.span
          className="absolute inset-0"
          animate={reduce ? undefined : { rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        >
          <span className="absolute inset-0 rounded-full border border-mint" />
          <span className="absolute left-1/2 top-0 size-2 -translate-x-1/2 rounded-full bg-link shadow-[0_0_10px_#0365f2]" />
        </motion.span>
        <span className="relative size-5 rounded-full bg-navy" />
      </span>
      {!compact && (
        <span className={cn("text-lg font-bold tracking-tight", light ? "text-white" : "text-navy")}>
          Virtual Internship
        </span>
      )}
    </div>
  );
}
