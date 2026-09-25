"use client";

import Image from "next/image";
import { ViewTransition } from "react";
import { cn } from "cn";

/**
 * The same `name` on the card, the detail page, and the player lets the
 * browser morph one cover instead of crossfading two unrelated images.
 * `default="none"` stops this cover from animating during unrelated routes.
 */
export function BookCover({
  id,
  src,
  alt,
  className,
  sizes,
  priority = false,
}: {
  id: string;
  src: string;
  alt: string;
  className?: string;
  sizes: string;
  priority?: boolean;
}) {
  return (
    <ViewTransition name={`book-${id}`} share="morph" default="none">
      <div className={cn("relative overflow-hidden bg-mist", className)}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      </div>
    </ViewTransition>
  );
}
