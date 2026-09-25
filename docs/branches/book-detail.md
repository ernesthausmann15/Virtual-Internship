# feature/book-detail

## What changed

`/book/[id]` shows the cover, title, author, subtitle, ratings, description, author bio, tags, and the summary. Read and Listen either open the player or stop the person who is not allowed in. “Add to My Library” saves the book, and `/library` lists what was saved.

## Why

The summary and the purchase gate both belong on the book, before audio starts. The library has to survive a refresh, so it cannot live only in the browser.

## How

`getBookById` loads one book. `decideAccess` returns wait, authenticate, upgrade, or allow: no user opens the auth dialog, a premium book without a subscription goes to `/choose-plan`, and a free book or an active plan opens `/player/[id]`. Library writes go to `users/{uid}/library/{bookId}` through `saveToLibrary` / `removeFromLibrary`. `watchSaved` and `watchLibrary` listen to those documents. `firestore.rules` lets only the owner create and update a library doc, and the `bookId` field must match the document id.
