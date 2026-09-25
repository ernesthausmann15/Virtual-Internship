"use client";

import { motion } from "framer-motion";
import { BookCard, BookRow } from "@/components/books/BookCard";
import type { Book } from "@/types/book";

export function ForYouView({
  selected,
  recommended,
  suggested,
}: {
  selected: Book[];
  recommended: Book[];
  suggested: Book[];
}) {
  const featured = selected[0];
  const restSelected = selected.slice(1);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <motion.h1
        className="mb-6 text-2xl font-bold text-navy"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        For you
      </motion.h1>

      {featured && (
        <section>
          <h2 className="mb-4 text-xl font-bold">Selected just for you</h2>
          <BookCard book={featured} large />
        </section>
      )}

      <BookRow title="Also selected" books={restSelected} />
      <BookRow title="Recommended for you" books={recommended} />
      <BookRow title="Suggested books" books={suggested} />
    </div>
  );
}
