import { ViewTransition } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <ViewTransition exit="slide-down" default="none">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <Skeleton className="mb-6 h-4 w-24" />
        <div className="grid gap-8 md:grid-cols-[240px_1fr]">
          <Skeleton className="aspect-[2/3] w-full max-w-60 rounded-xl" />
          <div className="space-y-3">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-10 w-64" />
          </div>
        </div>
        <Skeleton className="mt-12 h-40 w-full max-w-3xl" />
      </div>
    </ViewTransition>
  );
}
