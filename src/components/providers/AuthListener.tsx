"use client";

import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot } from "firebase/firestore";
import { getFirebaseAuth, getDb, isFirebaseConfigured } from "@/lib/firebase";
import { clearUser, setUser } from "@/store/slices/authSlice";
import {
  resetSubscription,
  setSubscription,
} from "@/store/slices/subscriptionSlice";
import { useAppDispatch } from "@/store/hooks";
import type { SubscriptionTier } from "@/types/user";

interface StripePrice {
  id?: string;
  recurring?: { interval?: string };
}

interface StripeSubscription {
  status?: string;
  items?: Array<{ price?: StripePrice; plan?: { interval?: string } }>;
}

/**
 * Firebase is the source of truth. This listener copies the session and the
 * Stripe subscription into Redux so any page can ask "who is this?" without
 * opening its own listener.
 */
export function AuthListener() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      dispatch(clearUser());
      return;
    }

    const auth = getFirebaseAuth();
    let stopSubscriptions = () => {};

    const stopAuth = onAuthStateChanged(auth, (user) => {
      stopSubscriptions();
      if (!user) {
        dispatch(clearUser());
        dispatch(resetSubscription());
        return;
      }

      dispatch(
        setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        }),
      );

      dispatch(setSubscription({ tier: "basic", status: "loading", priceId: null }));

      // The Stripe extension writes one document per subscription under the user.
      // We keep the live one (active or still inside the yearly trial).
      stopSubscriptions = onSnapshot(
        collection(getDb(), "customers", user.uid, "subscriptions"),
        (snapshot) => {
          const live = snapshot.docs
            .map((doc) => doc.data() as StripeSubscription)
            .find((item) => item.status === "active" || item.status === "trialing");

          if (!live) {
            dispatch(resetSubscription());
            return;
          }

          const price = live.items?.[0]?.price;
          const interval = price?.recurring?.interval ?? live.items?.[0]?.plan?.interval;
          const yearlyId = process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID;
          const tier: SubscriptionTier =
            price?.id === yearlyId || interval === "year" ? "premium-plus" : "premium";

          dispatch(
            setSubscription({
              tier,
              status: live.status === "trialing" ? "trialing" : "active",
              priceId: price?.id ?? null,
            }),
          );
        },
        () => {
          // A project without the Stripe extension simply has no subscription docs.
          dispatch(resetSubscription());
        },
      );
    });

    return () => {
      stopAuth();
      stopSubscriptions();
    };
  }, [dispatch]);

  return null;
}
