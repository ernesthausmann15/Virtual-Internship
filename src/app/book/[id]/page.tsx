import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { BookDetail } from "@/components/books/BookDetail";
import { getBookById } from "@/lib/books";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const book = await getBookById(id);
  return { title: book?.title ?? "Book" };
}

export default async function BookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const book = await getBookById(id);
  if (!book) notFound();

  return (
    <ViewTransition enter="slide-up" default="none">
      <BookDetail book={book} />
    </ViewTransition>
  );
}
