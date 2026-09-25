"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { HiPause, HiPlay } from "react-icons/hi2";
import { MdForward10, MdReplay10 } from "react-icons/md";
import { BookCover } from "@/components/books/BookCover";
import { Button } from "@/components/ui/button";
import { decideAccess } from "@/lib/access";
import { openAuthModal } from "@/store/slices/uiSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import type { Book } from "@/types/book";

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const whole = Math.floor(seconds);
  const minutes = Math.floor(whole / 60);
  const remain = whole % 60;
  return `${minutes}:${remain.toString().padStart(2, "0")}`;
}

export function PlayerView({ book }: { book: Book }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useSearchParams();
  const user = useAppSelector((state) => state.auth.user);
  const status = useAppSelector((state) => state.auth.status);
  const tier = useAppSelector((state) => state.subscription.tier);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const decision = decideAccess(status, user, tier, book.subscriptionRequired);
  const allowed = decision === "allow";

  useEffect(() => {
    if (decision === "authenticate") dispatch(openAuthModal("login"));
    if (decision === "upgrade") router.replace("/choose-plan");
  }, [decision, dispatch, router]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !allowed) return;

    let frame = 0;
    const tick = () => {
      setCurrent(audio.currentTime);
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
      if (!audio.paused) frame = requestAnimationFrame(tick);
    };
    const onPlay = () => {
      setPlaying(true);
      tick();
    };
    const onPause = () => {
      setPlaying(false);
      cancelAnimationFrame(frame);
      setCurrent(audio.currentTime);
    };

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onPause);
    audio.addEventListener("loadedmetadata", tick);

    // Listen mode should start audio; Read mode leaves the summary in front.
    if (params.get("mode") === "listen") {
      void audio.play().catch(() => setPlaying(false));
    }

    return () => {
      cancelAnimationFrame(frame);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onPause);
      audio.removeEventListener("loadedmetadata", tick);
    };
  }, [allowed, params]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.code !== "Space" || !allowed) return;
      const target = event.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA", "BUTTON"].includes(target.tagName)) return;
      event.preventDefault();
      const audio = audioRef.current;
      if (!audio) return;
      if (audio.paused) void audio.play();
      else audio.pause();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [allowed]);

  function skip(delta: number) {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.min(Math.max(0, audio.currentTime + delta), audio.duration || 0);
    setCurrent(audio.currentTime);
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-6 py-8 lg:grid-cols-[320px_1fr]">
      <aside className="lg:sticky lg:top-8 lg:self-start">
        <Link href={`/book/${book.id}`} transitionTypes={["nav-back"]} className="text-sm text-ink hover:text-navy">
          ← {book.title}
        </Link>
        <div className="mt-4">
          <BookCover
            id={book.id}
            src={book.imageLink}
            alt=""
            sizes="320px"
            className="mx-auto aspect-[2/3] w-full max-w-xs rounded-xl shadow-xl"
          />
        </div>
        <h1 className="mt-4 text-xl font-bold text-navy">{book.title}</h1>
        <p className="text-sm text-ink">{book.author}</p>

        <div className="mt-5 rounded-2xl bg-navy p-4 text-white">
          <audio ref={audioRef} src={allowed ? book.audioLink : undefined} preload="metadata" />
          <div className="mb-3 flex h-8 items-end justify-center gap-1" aria-hidden>
            {Array.from({ length: 7 }).map((_, index) => (
              <span
                key={index}
                className="eq-bar w-1 origin-bottom rounded-full bg-mint"
                style={{
                  height: 28,
                  animation: playing ? `equalizer 0.9s ease-in-out ${index * 0.08}s infinite` : undefined,
                  transform: playing ? undefined : "scaleY(0.3)",
                }}
              />
            ))}
          </div>
          <input
            aria-label="Seek"
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={Math.min(current, duration || 0)}
            disabled={!allowed}
            onChange={(event) => {
              const next = Number(event.target.value);
              if (audioRef.current) audioRef.current.currentTime = next;
              setCurrent(next);
            }}
            className="w-full accent-mint"
          />
          <div className="mt-1 flex justify-between text-xs text-white/70">
            <span>{formatTime(current)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <div className="mt-3 flex items-center justify-center gap-3">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" disabled={!allowed} onClick={() => skip(-10)} aria-label="Back 10 seconds">
              <MdReplay10 className="size-6" />
            </Button>
            <Button
              size="icon-lg"
              className="rounded-full"
              disabled={!allowed}
              aria-label={playing ? "Pause" : "Play"}
              onClick={() => {
                const audio = audioRef.current;
                if (!audio) return;
                if (audio.paused) void audio.play();
                else audio.pause();
              }}
            >
              {playing ? <HiPause className="size-5" /> : <HiPlay className="size-5" />}
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" disabled={!allowed} onClick={() => skip(10)} aria-label="Forward 10 seconds">
              <MdForward10 className="size-6" />
            </Button>
          </div>
          {!allowed && decision !== "wait" && (
            <p className="mt-3 text-center text-xs text-white/80">
              {decision === "upgrade" ? "Premium plan required for this title." : "Log in to play this summary."}
            </p>
          )}
        </div>
      </aside>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <h2 className="mb-4 text-2xl font-bold text-navy">Summary</h2>
        <p className="font-light leading-7 whitespace-pre-line text-ink">{book.summary}</p>
      </motion.section>
    </div>
  );
}
