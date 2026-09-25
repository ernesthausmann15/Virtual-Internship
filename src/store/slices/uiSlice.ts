import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthMode } from "@/types/user";

/**
 * The auth modal is global because Login is reachable from the landing page,
 * the sidebar, a premium book, and the sales page. One slice keeps every
 * trigger in sync instead of each page owning its own open/closed flag.
 */
interface UiState {
  authModalOpen: boolean;
  authMode: AuthMode;
}

const initialState: UiState = {
  authModalOpen: false,
  authMode: "login",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openAuthModal(state, action: PayloadAction<AuthMode | undefined>) {
      state.authModalOpen = true;
      state.authMode = action.payload ?? "login";
    },
    closeAuthModal(state) {
      state.authModalOpen = false;
    },
    setAuthMode(state, action: PayloadAction<AuthMode>) {
      state.authMode = action.payload;
    },
  },
});

export const { openAuthModal, closeAuthModal, setAuthMode } = uiSlice.actions;
export default uiSlice.reducer;
