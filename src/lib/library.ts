import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  type Unsubscribe,
} from "firebase/firestore";
import { getDb } from "@/lib/firebase";
import type { Book } from "@/types/book";

export interface LibraryEntry {
  bookId: string;
  title: string;
  author: string;
  imageLink: string;
  subTitle: string;
  subscriptionRequired: boolean;
  addedAt: number;
}

function libraryCollection(uid: string) {
  return collection(getDb(), "users", uid, "library");
}

function libraryDoc(uid: string, bookId: string) {
  return doc(getDb(), "users", uid, "library", bookId);
}

/** The document id is the book id, so saving twice updates the same shelf slot. */
export async function saveToLibrary(uid: string, book: Book) {
  await setDoc(libraryDoc(uid, book.id), {
    bookId: book.id,
    title: book.title,
    author: book.author,
    imageLink: book.imageLink,
    subTitle: book.subTitle,
    subscriptionRequired: book.subscriptionRequired,
    addedAt: serverTimestamp(),
  });
}

export async function removeFromLibrary(uid: string, bookId: string) {
  await deleteDoc(libraryDoc(uid, bookId));
}

/** One document listener is enough to know if this title is already saved. */
export function watchSaved(
  uid: string,
  bookId: string,
  onChange: (saved: boolean) => void,
): Unsubscribe {
  return onSnapshot(libraryDoc(uid, bookId), (snapshot) => {
    onChange(snapshot.exists());
  });
}

/**
 * Sorted in the client so we do not need a Firestore composite index
 * for a list that only one signed-in user can read.
 */
export function watchLibrary(uid: string, onChange: (books: LibraryEntry[]) => void): Unsubscribe {
  return onSnapshot(libraryCollection(uid), (snapshot) => {
    const books = snapshot.docs.map((entry) => {
      const data = entry.data();
      const addedAt = data.addedAt?.toMillis?.() ?? 0;
      return {
        bookId: String(data.bookId ?? entry.id),
        title: String(data.title ?? ""),
        author: String(data.author ?? ""),
        imageLink: String(data.imageLink ?? ""),
        subTitle: String(data.subTitle ?? ""),
        subscriptionRequired: Boolean(data.subscriptionRequired),
        addedAt,
      } satisfies LibraryEntry;
    });
    books.sort((a, b) => b.addedAt - a.addedAt);
    onChange(books);
  });
}
