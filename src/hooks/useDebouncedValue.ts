"use client";

import { useEffect, useState } from "react";

/**
 * Waits `delay` ms after the latest change before publishing the value.
 * Search uses 300ms so a fast typist does not fire a request per letter.
 */
export function useDebouncedValue<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(id);
  }, [value, delay]);

  return debounced;
}
