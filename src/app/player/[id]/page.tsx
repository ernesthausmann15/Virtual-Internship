import { Suspense, ViewTransition } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PlayerView } from "@/components/player/PlayerView";
import { Skeleton } from "@/components/ui/skeleton";
import { getBookById } from "@/lib/books";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const book = await getBookById(id);
  return { title: book ? `Play ${book.title}` : "Player" };
}

function PlayerSkeleton() {
  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-6 py-8 lg:grid-cols-[320px_1fr]">
      <Skeleton className="aspect-[2/3] w-full rounded-xl" />
      <Skeleton className="h-96 w-full" />
    </div>
  );
}

export default async function PlayerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const book = await getBookById(id);
  if (!book) notFound();

  return (
    <ViewTransition enter="slide-up" default="none">
      <Suspense fallback={<PlayerSkeleton />}>
        <PlayerView book={book} />
      </Suspense>
    </ViewTransition>
  );
}
