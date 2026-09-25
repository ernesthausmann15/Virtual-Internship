"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "cn";

type Node = { x: number; y: number; vx: number; vy: number; r: number };

/**
 * A living network behind the brand mark. Nodes drift, nearby nodes draw
 * a link, and the pointer gently attracts the field so the page feels
 * aware of the user. Canvas is used instead of dozens of DOM nodes so
 * the animation stays on one paint layer.
 */
export function AiField({
  className,
  density = 46,
}: {
  className?: string;
  density?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const nodes: Node[] = [];
    const pointer = { x: 0.62, y: 0.42 };
    let raf = 0;
    let width = 0;
    let height = 0;

    const seed = () => {
      nodes.length = 0;
      for (let i = 0; i < density; i += 1) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.32,
          vy: (Math.random() - 0.5) * 0.32,
          r: 1.1 + Math.random() * 1.7,
        });
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, width * dpr);
      canvas.height = Math.max(1, height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (nodes.length === 0 && width > 0) seed();
    };

    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      pointer.x = (event.clientX - rect.left) / rect.width;
      pointer.y = (event.clientY - rect.top) / rect.height;
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const px = pointer.x * width;
      const py = pointer.y * height;

      for (const node of nodes) {
        node.vx += (px - node.x) * 0.00002;
        node.vy += (py - node.y) * 0.00002;
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;
      }

      for (let i = 0; i < nodes.length; i += 1) {
        for (let j = i + 1; j < nodes.length; j += 1) {
          const a = nodes[i];
          const b = nodes[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 128) {
            const alpha = 0.32 * (1 - dist / 128);
            ctx.strokeStyle = `rgba(43, 217, 124, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (const node of nodes) {
        ctx.fillStyle = "rgba(3, 43, 65, 0.8)";
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    window.addEventListener("pointermove", onMove);
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, [density, reduce]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn("h-full w-full", reduce && "opacity-0", className)}
    />
  );
}
