"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { searchBooks } from "@/lib/books";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { Skeleton } from "@/components/ui/skeleton";
import type { Book } from "@/types/book";

export function SearchBar({ onNavigate }: { onNavigate?: () => void }) {
  const [query, setQuery] = useState("");
  const debounced = useDebouncedValue(query, 300);
  const [results, setResults] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const term = debounced.trim();
    if (!term) return;

    let cancelled = false;
    searchBooks(term)
      .then((books) => {
        if (!cancelled) {
          setResults(books);
          setError(null);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError("Search is unavailable right now.");
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [debounced]);

  const term = debounced.trim();
  const typed = query.trim();
  const pending = typed.length > 0 && (typed !== term || loading);
  const visibleResults = typed === term ? results : [];
  const visibleError = typed === term ? error : null;

  return (
    <div className="relative">
      <label className="sr-only" htmlFor="book-search">
        Search by title or author
      </label>
      <input
        id="book-search"
        value={query}
        onChange={(event) => {
          const next = event.target.value;
          setQuery(next);
          setError(null);
          setLoading(next.trim().length > 0);
        }}
        placeholder="Search"
        className="h-10 w-full rounded-lg border border-white/15 bg-white/10 px-3 text-sm text-white outline-none placeholder:text-white/50 focus:border-mint"
      />
      <AnimatePresence>
        {typed.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className="absolute top-12 z-30 max-h-80 w-full overflow-auto rounded-xl bg-white p-2 text-navy shadow-xl"
          >
            {pending && (
              <div className="space-y-2 p-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            )}
            {!pending && visibleError && <p className="p-2 text-sm text-destructive">{visibleError}</p>}
            {!pending && !visibleError && visibleResults.length === 0 && (
              <p className="p-2 text-sm text-ink">No matching books.</p>
            )}
            {!pending &&
              visibleResults.map((book) => (
                <Link
                  key={book.id}
                  href={`/book/${book.id}`}
                  transitionTypes={["nav-forward"]}
                  onClick={() => {
                    setQuery("");
                    onNavigate?.();
                  }}
                  className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-mist"
                >
                  <span
                    className="size-10 shrink-0 rounded bg-mist bg-cover bg-center"
                    style={{ backgroundImage: `url(${book.imageLink})` }}
                  />
                  <span>
                    <span className="block text-sm font-semibold">{book.title}</span>
                    <span className="block text-xs text-ink">{book.author}</span>
                  </span>
                </Link>
              ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
