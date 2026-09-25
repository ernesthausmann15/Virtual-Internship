"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookCover } from "@/components/books/BookCover";
import { PremiumPill } from "@/components/books/BookCard";
import { Skeleton } from "@/components/ui/skeleton";
import { isFirebaseConfigured } from "@/lib/firebase";
import { watchLibrary, type LibraryEntry } from "@/lib/library";
import { openAuthModal } from "@/store/slices/uiSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export function LibraryView() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const status = useAppSelector((state) => state.auth.status);
  const [books, setBooks] = useState<LibraryEntry[] | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      dispatch(openAuthModal("login"));
      setBooks([]);
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (!user || !isFirebaseConfigured()) {
      if (status !== "unknown") setBooks([]);
      return;
    }
    return watchLibrary(user.uid, setBooks);
  }, [status, user]);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="mb-6 text-2xl font-bold text-navy">My Library</h1>
      {books === null && (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="aspect-[2/3] w-full" />
          ))}
        </div>
      )}
      {books?.length === 0 && (
        <p className="font-light text-ink">
          Nothing saved yet. Open a book and choose Add to My Library.
        </p>
      )}
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4">
        {books?.map((book, index) => (
          <motion.div
            key={book.bookId}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link href={`/book/${book.bookId}`} transitionTypes={["nav-forward"]} className="block">
              <BookCover
                id={book.bookId}
                src={book.imageLink}
                alt=""
                sizes="200px"
                className="mb-2 aspect-[2/3] w-full rounded-lg"
              />
              {book.subscriptionRequired && <PremiumPill />}
              <p className="mt-2 line-clamp-2 text-sm font-semibold">{book.title}</p>
              <p className="text-sm text-ink">{book.author}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
