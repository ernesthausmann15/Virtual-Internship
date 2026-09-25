# feature/for-you-page

## What

`/for-you` lists selected, recommended, and suggested books. Cards show the cover, title, author, subtitle, and duration. Books that require a subscription get a Premium pill. Choosing a card opens `/book/[id]`.

## Why

This is the library people land in after login. The three rows match the Summarist API, and the pill has to be visible before someone opens a locked book.

## How

The server page calls `getBooksByStatus` for `selected`, `recommended`, and `suggested`, and revalidates every 60 seconds. `BookCard` links with `transitionTypes={["nav-forward"]}` so the route animation knows the direction. Covers use `next/image` (Firebase Storage is allowed in `next.config.ts`) and a view-transition name so the cover can morph into the detail page. `subscriptionRequired` drives the pill. Skeletons in `loading.tsx` cover the wait. Logging in from `/` routes to `/for-you`.
