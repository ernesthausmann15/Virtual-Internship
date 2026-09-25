import { ViewTransition } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <ViewTransition exit="slide-down" default="none">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-8 lg:grid-cols-[320px_1fr]">
        <Skeleton className="aspect-[2/3] w-full rounded-xl" />
        <div className="space-y-3">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    </ViewTransition>
  );
}
