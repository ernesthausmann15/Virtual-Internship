"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { signOut } from "firebase/auth";
import { getFirebaseAuth, isFirebaseConfigured } from "@/lib/firebase";
import { openAuthModal } from "@/store/slices/uiSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { cn } from "cn";
import type { SubscriptionTier } from "@/types/user";

const planLabel: Record<SubscriptionTier, string> = {
  basic: "Basic",
  premium: "Premium",
  "premium-plus": "Premium-Plus",
};

export function SettingsView() {
  const dispatch = useAppDispatch();
  const params = useSearchParams();
  const status = useAppSelector((state) => state.auth.status);
  const user = useAppSelector((state) => state.auth.user);
  const tier = useAppSelector((state) => state.subscription.tier);
  const subStatus = useAppSelector((state) => state.subscription.status);

  if (status === "unknown" || subStatus === "loading") {
    return (
      <div className="mx-auto max-w-xl space-y-4 px-6 py-10">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-xl px-6 py-16 text-center">
        <h1 className="text-2xl font-bold text-navy">Settings</h1>
        <p className="mt-3 text-ink">Log in to see your email and plan.</p>
        <Button className="mt-6 h-10" onClick={() => dispatch(openAuthModal("login"))}>
          Login
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      className="mx-auto max-w-xl px-6 py-10"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className="text-2xl font-bold text-navy">Settings</h1>
      {params.get("checkout") === "success" && (
        <p className="mt-4 rounded-lg bg-mint/30 px-4 py-3 text-sm text-navy">
          Checkout finished. Your plan updates as soon as Stripe confirms it.
        </p>
      )}

      <section className="mt-6 rounded-2xl bg-mist p-5">
        <p className="text-sm text-ink">Email</p>
        <p className="mt-1 font-medium">{user.email ?? "No email on this account"}</p>
      </section>

      <section className="mt-4 rounded-2xl bg-mist p-5">
        <p className="text-sm text-ink">Subscription</p>
        <div className="mt-2 flex items-center gap-3">
          <Badge className="border-0 bg-navy text-white">{planLabel[tier]}</Badge>
          {subStatus === "trialing" && <span className="text-sm text-link">7-day trial</span>}
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          {tier === "basic" && (
            <Link href="/choose-plan" transitionTypes={["nav-forward"]} className={cn(buttonVariants({ className: "h-10" }))}>
              Upgrade to Premium
            </Link>
          )}
          {tier === "premium" && (
            <Link href="/choose-plan" transitionTypes={["nav-forward"]} className={cn(buttonVariants({ className: "h-10" }))}>
              Upgrade to Premium-Plus
            </Link>
          )}
          {tier === "premium-plus" && <p className="text-sm text-ink">You are on the highest plan.</p>}
        </div>
      </section>

      <Button
        variant="outline"
        className="mt-6 h-10"
        onClick={() => {
          if (isFirebaseConfigured()) void signOut(getFirebaseAuth());
        }}
      >
        Log out
      </Button>
    </motion.div>
  );
}
