/** Tiers shown on Settings. Yearly Stripe plans map to Premium Plus. */
export type SubscriptionTier = "basic" | "premium" | "premium-plus";

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export type AuthMode = "login" | "register" | "reset";
