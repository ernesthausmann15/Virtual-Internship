"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { BsStarFill } from "react-icons/bs";
import { Badge } from "@/components/ui/badge";
import { BookCover } from "@/components/books/BookCover";
import type { Book } from "@/types/book";

export function PremiumPill() {
  return <Badge className="premium-pill border-0 text-[10px] tracking-wide uppercase">Premium</Badge>;
}

export function BookCard({ book, large = false }: { book: Book; large?: boolean }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      whileHover={reduce ? undefined : { y: large ? -4 : -8 }}
      transition={{ type: "spring", stiffness: 340, damping: 24 }}
      className={large ? "w-full" : "w-44 shrink-0"}
    >
      <Link
        href={`/book/${book.id}`}
        transitionTypes={["nav-forward"]}
        className={large ? "grid gap-6 md:grid-cols-[220px_1fr]" : "block"}
      >
        <BookCover
          id={book.id}
          src={book.imageLink}
          alt=""
          priority={large}
          sizes={large ? "220px" : "176px"}
          className={large ? "h-72 w-full rounded-xl md:h-64" : "mb-3 aspect-[2/3] w-full rounded-lg"}
        />
        <div>
          <div className="mb-2 flex items-center gap-2">
            {book.subscriptionRequired && <PremiumPill />}
            <span className="text-xs text-ink">{book.type}</span>
          </div>
          <h3 className={`font-semibold text-navy ${large ? "text-2xl" : "line-clamp-2 text-sm"}`}>
            {book.title}
          </h3>
          <p className="mt-1 text-sm text-ink">{book.author}</p>
          {large && <p className="mt-3 font-light text-ink">{book.subTitle}</p>}
          <p className="mt-2 flex items-center gap-1 text-sm text-link">
            <BsStarFill className="size-3.5" />
            {book.averageRating}
            <span className="text-ink">({book.totalRating})</span>
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

export function BookRow({ title, books }: { title: string; books: Book[] }) {
  if (books.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="mb-4 text-xl font-bold text-navy">{title}</h2>
      <div className="flex gap-5 overflow-x-auto pb-4">
        {books.map((book, index) => (
          <motion.div
            key={book.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.4 }}
          >
            <BookCard book={book} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
