import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { getDb } from "@/lib/firebase";

/**
 * The Stripe Firebase extension watches `customers/{uid}/checkout_sessions`.
 * We only create the session document. The extension adds `url` (or `error`)
 * and this listener sends the browser to Stripe Checkout.
 * Yearly plans request a 7-day trial; monthly plans bill immediately.
 */
export function startStripeCheckout(uid: string, priceId: string, yearly: boolean) {
  const sessions = collection(getDb(), "customers", uid, "checkout_sessions");

  return new Promise<void>((resolve, reject) => {
    addDoc(sessions, {
      price: priceId,
      success_url: `${window.location.origin}/settings?checkout=success`,
      cancel_url: `${window.location.origin}/choose-plan?checkout=cancel`,
      allow_promotion_codes: true,
      ...(yearly ? { trial_period_days: 7 } : {}),
    })
      .then((ref) => {
        const stop = onSnapshot(
          ref,
          (snapshot) => {
            const data = snapshot.data();
            if (!data) return;
            if (typeof data.url === "string") {
              stop();
              window.location.assign(data.url);
              resolve();
            }
            if (data.error) {
              stop();
              const message =
                typeof data.error.message === "string" ? data.error.message : "Checkout could not start.";
              reject(new Error(message));
            }
          },
          (error) => {
            reject(error);
          },
        );
      })
      .catch(reject);
  });
}
