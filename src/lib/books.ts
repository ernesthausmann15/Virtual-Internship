import type { Book, BookStatus } from "@/types/book";

const BASE = "https://us-central1-summaristt.cloudfunctions.net";

async function readBooks(url: string, cache?: RequestCache): Promise<Book[]> {
  const response = await fetch(url, cache ? { cache } : undefined);
  if (!response.ok) {
    throw new Error("Could not load books.");
  }
  const data: unknown = await response.json();
  return Array.isArray(data) ? (data as Book[]) : [];
}

/** Selected, recommended, and suggested feeds. Cached with the page's revalidate. */
export function getBooksByStatus(status: BookStatus) {
  return readBooks(`${BASE}/getBooks?status=${status}`);
}

export async function getBookById(id: string): Promise<Book | null> {
  const response = await fetch(`${BASE}/getBook?id=${encodeURIComponent(id)}`);
  if (response.status === 404) return null;
  if (!response.ok) throw new Error("Could not load this book.");
  const data: unknown = await response.json();
  if (!data || typeof data !== "object" || !("id" in data)) return null;
  return data as Book;
}

/**
 * Called from the browser on each debounced search. `cache: "no-store"`
 * keeps a second search for the same letters from replaying a stale list.
 */
export function searchBooks(search: string) {
  return readBooks(
    `${BASE}/getBooksByAuthorOrTitle?search=${encodeURIComponent(search)}`,
    "no-store",
  );
}
