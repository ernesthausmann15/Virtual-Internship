"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BsStarFill } from "react-icons/bs";
import { AiField } from "@/components/motion/AiField";
import { BookCover } from "@/components/books/BookCover";
import { PremiumPill } from "@/components/books/BookCard";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { decideAccess } from "@/lib/access";
import { isFirebaseConfigured } from "@/lib/firebase";
import { removeFromLibrary, saveToLibrary, watchSaved } from "@/lib/library";
import { openAuthModal } from "@/store/slices/uiSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import type { Book } from "@/types/book";
import { cn } from "cn";

export function BookDetail({ book }: { book: Book }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const status = useAppSelector((state) => state.auth.status);
  const tier = useAppSelector((state) => state.subscription.tier);
  const [saved, setSaved] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !isFirebaseConfigured()) return;
    return watchSaved(user.uid, book.id, setSaved);
  }, [book.id, user]);

  const isSaved = Boolean(user) && saved;

  const decision = decideAccess(status, user, tier, book.subscriptionRequired);

  function gatedClick() {
    if (decision === "authenticate") dispatch(openAuthModal("login"));
    if (decision === "upgrade") router.push("/choose-plan");
  }

  async function toggleLibrary() {
    if (!user) {
      dispatch(openAuthModal("login"));
      return;
    }
    if (!isFirebaseConfigured()) {
      setError("Add Firebase keys to .env.local to save books.");
      return;
    }
    setPending(true);
    setError(null);
    try {
      if (isSaved) await removeFromLibrary(user.uid, book.id);
      else await saveToLibrary(user.uid, book);
    } catch {
      setError("Could not update your library.");
    } finally {
      setPending(false);
    }
  }

  const playerHref = `/player/${book.id}`;

  return (
    <article className="mx-auto max-w-5xl px-6 py-10">
      <Link href="/for-you" transitionTypes={["nav-back"]} className="text-sm text-ink hover:text-navy">
        ← For you
      </Link>

      <div className="relative mt-6 grid items-start gap-8 md:grid-cols-[240px_1fr]">
        <div className="pointer-events-none absolute -top-10 right-0 hidden h-40 w-64 md:block">
          <AiField density={16} />
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.45 }}>
          <BookCover
            id={book.id}
            src={book.imageLink}
            alt=""
            priority
            sizes="240px"
            className="mx-auto aspect-[2/3] w-full max-w-60 rounded-xl shadow-lg"
          />
        </motion.div>

        <div>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {book.subscriptionRequired && <PremiumPill />}
            <span className="text-sm text-ink">{book.type}</span>
          </div>
          <h1 className="text-3xl font-bold text-navy">{book.title}</h1>
          <p className="mt-2 text-lg font-light text-ink">{book.subTitle}</p>
          <p className="mt-3 font-medium">{book.author}</p>
          <p className="mt-3 flex flex-wrap items-center gap-4 text-sm text-ink">
            <span className="flex items-center gap-1 text-link">
              <BsStarFill /> {book.averageRating}
              <span className="text-ink">({book.totalRating})</span>
            </span>
            <span>{book.keyIdeas} key ideas</span>
          </p>

          {book.tags && book.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {book.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            {decision === "allow" ? (
              <>
                <Link
                  href={`${playerHref}?mode=read`}
                  transitionTypes={["nav-forward"]}
                  className={cn(buttonVariants({ className: "h-10 px-5" }))}
                >
                  Read
                </Link>
                <Link
                  href={`${playerHref}?mode=listen`}
                  transitionTypes={["nav-forward"]}
                  className={cn(buttonVariants({ variant: "outline", className: "h-10 px-5" }))}
                >
                  Listen
                </Link>
              </>
            ) : (
              <>
                <Button className="h-10 px-5" onClick={gatedClick} disabled={decision === "wait"}>
                  Read
                </Button>
                <Button variant="outline" className="h-10 px-5" onClick={gatedClick} disabled={decision === "wait"}>
                  Listen
                </Button>
              </>
            )}
            <Button variant="secondary" className="h-10 px-5" onClick={() => void toggleLibrary()} disabled={pending}>
              {isSaved ? "Remove from My Library" : "Add to My Library"}
            </Button>
          </div>
          {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
        </div>
      </div>

      <section className="mt-12 max-w-3xl space-y-8">
        {book.bookDescription && (
          <div>
            <h2 className="mb-2 text-xl font-semibold">About the book</h2>
            <p className="font-light leading-relaxed whitespace-pre-line text-ink">{book.bookDescription}</p>
          </div>
        )}
        {book.authorDescription && (
          <div>
            <h2 className="mb-2 text-xl font-semibold">About the author</h2>
            <p className="font-light leading-relaxed whitespace-pre-line text-ink">{book.authorDescription}</p>
          </div>
        )}
        <div>
          <h2 className="mb-2 text-xl font-semibold">Summary</h2>
          <p className="font-light leading-relaxed whitespace-pre-line text-ink">{book.summary}</p>
        </div>
      </section>
    </article>
  );
}
