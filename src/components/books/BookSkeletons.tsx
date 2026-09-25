import { Skeleton } from "@/components/ui/skeleton";

export function BookRowSkeleton() {
  return (
    <div className="mt-10">
      <Skeleton className="mb-4 h-7 w-48" />
      <div className="flex gap-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="w-44 shrink-0">
            <Skeleton className="mb-3 aspect-[2/3] w-full" />
            <Skeleton className="mb-2 h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ForYouSkeleton() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <Skeleton className="mb-6 h-8 w-40" />
      <div className="grid gap-6 md:grid-cols-[220px_1fr]">
        <Skeleton className="h-64 w-full rounded-xl" />
        <div className="space-y-3">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-16 w-full" />
        </div>
      </div>
      <BookRowSkeleton />
      <BookRowSkeleton />
    </div>
  );
}
