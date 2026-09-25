"use client";

import { useState } from "react";
import { Provider } from "react-redux";
import { store } from "@/store/store";

/**
 * The store is created once per browser session. `useState` keeps that
 * instance stable across re-renders without putting a singleton in a
 * server component, which would leak state between requests.
 */
export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [reduxStore] = useState(() => store);

  return <Provider store={reduxStore}>{children}</Provider>;
}
