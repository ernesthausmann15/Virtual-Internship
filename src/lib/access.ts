import type { AuthUser, SubscriptionTier } from "@/types/user";

export type AccessDecision = "wait" | "authenticate" | "upgrade" | "allow";

/**
 * Read and Listen share one gate:
 * guests see the auth modal, signed-in users without a plan are sent to
 * pricing, and free books (or any book for a paying member) open the player.
 * `wait` covers the moment before Firebase restores the session.
 */
export function decideAccess(
  status: "unknown" | "authenticated" | "unauthenticated",
  user: AuthUser | null,
  tier: SubscriptionTier,
  subscriptionRequired: boolean,
): AccessDecision {
  if (status === "unknown") return "wait";
  if (!user) return "authenticate";
  if (subscriptionRequired && tier === "basic") return "upgrade";
  return "allow";
}
