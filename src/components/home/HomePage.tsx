"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  AiFillAudio,
  AiFillBulb,
  AiFillFileText,
} from "react-icons/ai";
import { BiCrown } from "react-icons/bi";
import { BsStarFill, BsStarHalf } from "react-icons/bs";
import { RiLeafLine } from "react-icons/ri";
import { AiLogo } from "@/components/brand/AiLogo";
import { BrandMark } from "@/components/brand/BrandMark";
import { AiField } from "@/components/motion/AiField";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/button";
import { cinematicEase } from "@/lib/motion";
import { openAuthModal } from "@/store/slices/uiSlice";
import { useAppDispatch } from "@/store/hooks";

const features = [
  {
    icon: AiFillFileText,
    title: "Read or listen",
    body: "Save time by getting the core ideas from the best books.",
  },
  {
    icon: AiFillBulb,
    title: "Find your next read",
    body: "Explore book lists and personalized recommendations.",
  },
  {
    icon: AiFillAudio,
    title: "Briefcasts",
    body: "Gain valuable insights from briefcasts.",
  },
];

const growth = [
  "Enhance your knowledge",
  "Achieve greater success",
  "Improve your health",
  "Develop better parenting skills",
  "Increase happiness",
  "Be the best version of yourself!",
];

const growthAlt = [
  "Expand your learning",
  "Accomplish your goals",
  "Strengthen your vitality",
  "Become a better caregiver",
  "Improve your mood",
  "Maximize your abilities",
];

const stats = [
  ["93%", "of Virtual Internship members significantly increase reading frequency."],
  ["96%", "of Virtual Internship members establish better habits."],
  ["90%", "have made significant positive change to their lives."],
];

const statsAlt = [
  ["91%", "of Virtual Internship members report feeling more productive after incorporating the service into their daily routine."],
  ["94%", "of Virtual Internship members have noticed an improvement in their overall comprehension and retention of information."],
  ["88%", "of Virtual Internship members feel more informed about current events and industry trends since using the platform."],
];

const reviews = [
  ["Hanna M.", "This app has been a game-changer for me! It's saved me so much time and effort in reading and comprehending books. Highly recommend it to all book lovers."],
  ["David B.", "I love this app! It provides concise and accurate summaries of books in a way that is easy to understand. It's also very user-friendly and intuitive."],
  ["Nathan S.", "This app is a great way to get the main takeaways from a book without having to read the entire thing. The summaries are well-written and informative. Definitely worth downloading."],
  ["Ryan R.", "If you're a busy person who loves reading but doesn't have the time to read every book in full, this app is for you! The summaries are thorough and provide a great overview of the book's content."],
];

const numbers = [
  { icon: BiCrown, title: "3 Million", body: "Downloads on all platforms", stars: false },
  { icon: BsStarFill, title: "4.5 Stars", body: "Average ratings on iOS and Google Play", stars: true },
  { icon: RiLeafLine, title: "97%", body: "Of Virtual Internship members create a better reading habit", stars: false },
];

const footer = [
  ["Actions", ["Summarist Magazine", "Cancel Subscription", "Help", "Contact us"]],
  ["Useful Links", ["Pricing", "Summarist Business", "Gift Cards", "Authors & Publishers"]],
  ["Company", ["About", "Careers", "Partners", "Code of Conduct"]],
  ["Other", ["Sitemap", "Legal Notice", "Terms of Service", "Privacy Policies"]],
];

function LoginButton({ label = "Login" }: { label?: string }) {
  const dispatch = useAppDispatch();
  return (
    <Button
      className="h-11 min-w-44 px-6 text-base font-semibold"
      onClick={() => dispatch(openAuthModal("login"))}
    >
      {label}
    </Button>
  );
}

function PhraseColumn({ phrases, align = "start" }: { phrases: string[]; align?: "start" | "end" }) {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => {
      setActive((current) => (current + 1) % phrases.length);
    }, 1800);
    return () => window.clearInterval(id);
  }, [phrases.length, reduce]);

  return (
    <div className={`flex flex-col justify-center gap-4 ${align === "end" ? "items-end text-right max-md:items-start max-md:text-left" : ""}`}>
      {phrases.map((phrase, index) => (
        <motion.p
          key={phrase}
          animate={{ color: index === active ? "#2bd97c" : "#6b757b", x: index === active && !reduce ? 6 : 0 }}
          transition={{ duration: 0.45 }}
          className="text-2xl font-medium md:text-[32px]"
        >
          {phrase}
        </motion.p>
      ))}
    </div>
  );
}

function StatList({ items }: { items: string[][] }) {
  return (
    <div className="flex flex-col justify-center gap-6 bg-mist px-6 py-10">
      {items.map(([value, label]) => (
        <div key={value} className="flex gap-4">
          <span className="mt-1 text-xl font-semibold text-link">{value}</span>
          <p className="text-lg font-light text-ink">{label}</p>
        </div>
      ))}
    </div>
  );
}

export function HomePage() {
  const dispatch = useAppDispatch();
  const reduce = useReducedMotion();
  const title = "Gain more knowledge in less time".split(" ");

  return (
    <div className="bg-white text-navy">
      <header className="relative z-10 mx-auto flex h-20 w-full max-w-5xl items-center justify-between px-6">
        <BrandMark />
        <nav className="flex items-center gap-6 text-sm">
          <span className="hidden text-ink md:inline">About</span>
          <span className="hidden text-ink md:inline">Contact</span>
          <span className="hidden text-ink md:inline">Help</span>
          <button
            type="button"
            className="font-medium transition-colors hover:text-mint-dark"
            onClick={() => dispatch(openAuthModal("login"))}
          >
            Login
          </button>
        </nav>
      </header>

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <AiField />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-white/40" />
        </div>
        <div className="relative mx-auto grid max-w-5xl items-center gap-10 px-6 py-16 md:grid-cols-2 md:py-24">
          <div className="order-2 md:order-1">
            <h1 className="text-4xl font-bold leading-tight md:text-5xl">
              {title.map((word, index) => (
                <motion.span
                  key={`${word}-${index}`}
                  className="mr-2 inline-block"
                  initial={reduce ? false : { opacity: 0, y: 18, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ delay: 0.08 * index, duration: 0.55, ease: cinematicEase }}
                >
                  {word}
                </motion.span>
              ))}
            </h1>
            <motion.p
              className="mt-6 max-w-xl text-xl font-light leading-relaxed text-ink"
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.6 }}
            >
              Great summaries for busy people, individuals who barely have time to read, and even people who don’t like to read.
            </motion.p>
            <motion.div
              className="mt-8"
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75 }}
            >
              <LoginButton />
            </motion.div>
          </div>
          <motion.div
            className="relative order-1 md:order-2"
            initial={reduce ? false : { opacity: 0, scale: 0.92 }}
            animate={reduce ? undefined : { opacity: 1, scale: 1, y: [0, -10, 0] }}
            transition={{
              opacity: { duration: 0.7 },
              scale: { duration: 0.7, ease: cinematicEase },
              y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
            }}
          >
            <AiLogo />
            <p className="mt-2 text-center text-sm font-medium tracking-wide text-ink">
              Move across the mark. It leans with you.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <Reveal>
          <h2 className="mb-10 text-center text-3xl font-bold">Understand books in few minutes</h2>
        </Reveal>
        <RevealGroup className="grid gap-10 md:grid-cols-3">
          {features.map((feature) => (
            <RevealItem key={feature.title} className="flex flex-col items-center text-center">
              <feature.icon className="mb-3 size-14 text-navy" />
              <h3 className="mb-3 text-2xl font-medium">{feature.title}</h3>
              <p className="font-light text-ink">{feature.body}</p>
            </RevealItem>
          ))}
        </RevealGroup>

        <div className="mt-20 grid items-center gap-10 md:grid-cols-2">
          <PhraseColumn phrases={growth} />
          <Reveal>
            <StatList items={stats} />
          </Reveal>
        </div>
        <div className="mt-16 grid items-center gap-10 md:grid-cols-2">
          <Reveal className="max-md:order-1">
            <StatList items={statsAlt} />
          </Reveal>
          <PhraseColumn phrases={growthAlt} align="end" />
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-xl px-6">
          <Reveal>
            <h2 className="mb-8 text-center text-3xl font-bold">What our members say</h2>
          </Reveal>
          <div className="space-y-6">
            {reviews.map(([name, quote], index) => (
              <Reveal key={name} delay={index * 0.05}>
                <article className="rounded-md bg-cream p-4 font-light">
                  <div className="mb-2 flex items-center gap-2 font-medium">
                    {name}
                    <span className="flex text-link">
                      {Array.from({ length: 5 }).map((_, star) => (
                        <BsStarFill key={star} className="size-4" />
                      ))}
                    </span>
                  </div>
                  <p className="leading-relaxed text-ink">{quote}</p>
                </article>
              </Reveal>
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <LoginButton />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <Reveal>
          <h2 className="mb-10 text-center text-3xl font-bold">Start growing with Virtual Internship now</h2>
        </Reveal>
        <RevealGroup className="grid gap-6 md:grid-cols-3">
          {numbers.map((item) => (
            <RevealItem key={item.title} className="flex flex-col items-center rounded-xl bg-sky px-6 py-8 text-center">
              <div className="mb-3 flex h-14 items-center text-link">
                {item.stars ? (
                  <span className="flex gap-1">
                    <BsStarFill className="size-5" />
                    <BsStarFill className="size-5" />
                    <BsStarFill className="size-5" />
                    <BsStarFill className="size-5" />
                    <BsStarHalf className="size-5" />
                  </span>
                ) : (
                  <item.icon className="size-12" />
                )}
              </div>
              <p className="text-4xl font-semibold">{item.title}</p>
              <p className="mt-3 font-light text-ink">{item.body}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <footer className="bg-mist">
        <div className="mx-auto grid max-w-5xl gap-8 px-6 py-12 md:grid-cols-4">
          {footer.map(([title, links]) => (
            <div key={title as string}>
              <p className="mb-4 text-lg font-semibold">{title as string}</p>
              <ul className="space-y-3 text-sm text-ink">
                {(links as string[]).map((link) => (
                  <li key={link}>{link}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="pb-8 text-center text-sm font-medium">Copyright © {new Date().getFullYear()} Virtual Internship.</p>
      </footer>
    </div>
  );
}
