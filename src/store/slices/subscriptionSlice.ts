import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { SubscriptionTier } from "@/types/user";

export type SubscriptionStatus = "loading" | "none" | "active" | "trialing";

interface SubscriptionState {
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  /** Stripe price id of the active item, used to tell monthly from yearly. */
  priceId: string | null;
}

const initialState: SubscriptionState = {
  tier: "basic",
  status: "none",
  priceId: null,
};

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {
    setSubscription(
      state,
      action: PayloadAction<{
        tier: SubscriptionTier;
        status: SubscriptionStatus;
        priceId: string | null;
      }>,
    ) {
      state.tier = action.payload.tier;
      state.status = action.payload.status;
      state.priceId = action.payload.priceId;
    },
    resetSubscription(state) {
      state.tier = "basic";
      state.status = "none";
      state.priceId = null;
    },
  },
});

export const { setSubscription, resetSubscription } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
