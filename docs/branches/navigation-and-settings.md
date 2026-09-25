# feature/navigation-and-settings

## What changed

A sidebar is on every page except `/` and `/choose-plan`. It links to For You, My Library, and Settings, includes search and a help mailto, and shows Login or Logout. Settings shows the account email and the plan name: Basic, Premium, or Premium-Plus, with links to upgrade. Skeleton loaders cover the book rows, the player, and settings while data is in flight.

## Why

Once someone is inside the product, the same navigation has to be one click away, and search should not fire a request on every keystroke. Settings is where the plan the Stripe listener stored becomes something a person can read.

## How

`AppShell` checks the pathname and skips the sidebar on the landing page and the pricing page. On a narrow screen the sidebar is a drawer. `useDebouncedValue` waits 300ms, and `SearchBar` only requests `getBooksByAuthorOrTitle` after that pause. Settings reads `auth` and `subscription` from Redux. Plan labels map `basic` → Basic, `premium` → Premium, and `premium-plus` → Premium-Plus. Two follow-up fixes landed on this branch: the library listener had been split incorrectly and was restored, and auth starts as logged out when Firebase is not configured so the server and client render the same settings prompt.
