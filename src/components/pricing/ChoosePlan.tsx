"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { AiField } from "@/components/motion/AiField";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { isFirebaseConfigured } from "@/lib/firebase";
import { startStripeCheckout } from "@/lib/stripe";
import { openAuthModal } from "@/store/slices/uiSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

const faqs = [
  {
    q: "How does the free 7-day trial work?",
    a: "Begin your complimentary 7-day trial with a Virtual Internship annual membership. You are under no obligation to continue your subscription, and you will only be billed when the trial period expires. With Premium access, you can learn at your own pace and as frequently as you desire, and you may terminate your subscription prior to the conclusion of the 7-day free trial.",
  },
  {
    q: "Can I switch subscriptions from monthly to yearly, or yearly to monthly?",
    a: "While an annual plan is active, it is not feasible to switch to a monthly plan. However, once the current month ends, transitioning from a monthly plan to an annual plan is an option.",
  },
  {
    q: "What's included in the Premium plan?",
    a: "Premium membership provides you with the ultimate Virtual Internship experience, including unrestricted entry to many best-selling books, high-quality audio, the ability to download titles for offline reading, and the option to send your reads to your Kindle.",
  },
  {
    q: "Can I cancel during my trial or subscription?",
    a: "You will not be charged if you cancel your trial before its conclusion. While you will not have complete access to the entire library, you can still expand your knowledge with one curated book per day.",
  },
];

type Cycle = "monthly" | "yearly";

export function ChoosePlan() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [cycle, setCycle] = useState<Cycle>("yearly");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const yearly = cycle === "yearly";
  const priceId = yearly
    ? process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID
    : process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID;

  async function subscribe() {
    setError(null);
    if (!user) {
      dispatch(openAuthModal("login"));
      return;
    }
    if (!isFirebaseConfigured()) {
      setError("Add Firebase keys to .env.local before starting checkout.");
      return;
    }
    if (!priceId) {
      setError("Add the Stripe price id for this plan to .env.local.");
      return;
    }
    setPending(true);
    try {
      await startStripeCheckout(user.uid, priceId, yearly);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Checkout could not start.");
      setPending(false);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="relative overflow-hidden bg-navy text-white">
        <div className="pointer-events-none absolute inset-0 opacity-70">
          <AiField density={36} />
        </div>
        <div className="relative mx-auto flex max-w-5xl flex-col items-center px-6 py-14 text-center">
          <Link href="/for-you" transitionTypes={["nav-back"]} className="mb-6 text-sm text-white/80">
            ← Back
          </Link>
          <Image src="/images/pricing-top.png" alt="" width={280} height={160} className="mb-6 h-auto w-56" />
          <h1 className="max-w-xl text-3xl font-bold md:text-4xl">
            Get unlimited access to summaries you can read or listen to
          </h1>
        </div>
      </header>

      <div className="mx-auto max-w-lg px-6 py-12">
        <div className="relative mx-auto mb-8 grid w-full max-w-xs grid-cols-2 rounded-full bg-mist p-1">
          {(["monthly", "yearly"] as const).map((option) => (
            <button
              key={option}
              type="button"
              className="relative z-10 h-10 rounded-full text-sm font-semibold capitalize"
              onClick={() => setCycle(option)}
            >
              {cycle === option && (
                <motion.span
                  layoutId="billing-pill"
                  className="absolute inset-0 rounded-full bg-navy"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className={`relative ${cycle === option ? "text-white" : "text-navy"}`}>
                {option}
                {option === "yearly" ? " · trial" : ""}
              </span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={cycle}
            initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -12, filter: "blur(6px)" }}
            transition={{ duration: 0.35 }}
            className="rounded-2xl bg-mist p-8 text-center"
          >
            <p className="text-sm font-semibold tracking-wide text-link uppercase">
              {yearly ? "Premium Plus" : "Premium"}
            </p>
            <p className="mt-3 text-5xl font-bold text-navy">{yearly ? "$99.99" : "$9.99"}</p>
            <p className="mt-2 text-ink">{yearly ? "per year after a 7-day free trial" : "per month, billed monthly"}</p>
            <ul className="mt-6 space-y-2 text-left text-sm text-ink">
              <li>Unlimited book summaries</li>
              <li>Read and listen on any device</li>
              <li>{yearly ? "7 days free, cancel before you are billed" : "Cancel any time"}</li>
            </ul>
            <Button className="mt-8 h-11 w-full text-base" disabled={pending} onClick={() => void subscribe()}>
              {pending ? "Opening checkout…" : yearly ? "Start 7-day free trial" : "Subscribe monthly"}
            </Button>
            {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
          </motion.div>
        </AnimatePresence>

        <Accordion className="mt-10">
          {faqs.map((faq) => (
            <AccordionItem key={faq.q} value={faq.q}>
              <AccordionTrigger className="text-base text-navy">{faq.q}</AccordionTrigger>
              <AccordionContent className="text-ink">{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
