import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import subscriptionReducer from "./slices/subscriptionSlice";
import uiReducer from "./slices/uiSlice";

/**
 * One store for the three pieces of state that cross routes:
 * whether the auth modal is open, who is signed in, and which plan they have.
 * Page-local data (search text, audio progress) stays in component state.
 */
export const store = configureStore({
  reducer: {
    ui: uiReducer,
    auth: authReducer,
    subscription: subscriptionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
