import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { isFirebaseConfigured } from "@/lib/firebase";
import type { AuthUser } from "@/types/user";

/**
 * `unknown` means Firebase is configured and we are still restoring a session.
 * If there is no project yet, start as logged out so the server and the browser
 * render the same buttons instead of a disabled "please wait" state.
 */
type AuthStatus = "unknown" | "authenticated" | "unauthenticated";

interface AuthState {
  status: AuthStatus;
  user: AuthUser | null;
}

const initialState: AuthState = {
  status: isFirebaseConfigured() ? "unknown" : "unauthenticated",
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
