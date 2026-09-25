import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthUser } from "@/types/user";

/**
 * `unknown` is the first paint, before Firebase has restored a session.
 * Access checks must wait for this so a subscribed user is not bounced
 * to the login modal during that brief hydration window.
 */
type AuthStatus = "unknown" | "authenticated" | "unauthenticated";

interface AuthState {
  status: AuthStatus;
  user: AuthUser | null;
}

const initialState: AuthState = {
  status: "unknown",
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload;
      state.status = "authenticated";
    },
    clearUser(state) {
      state.user = null;
      state.status = "unauthenticated";
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
