# feature/home-page

## What changed

The `/` route became the Summarist landing page: hero, feature row, statistics, reviews, a closing call to action, and a footer. Motion includes a neural field, a small orbiting mark in the header, words that arrive one at a time, and sections that rise in as they scroll into view.

## Why

The capstone asked for the Summarist marketing page, with motion that makes the first visit feel directed rather than a static screenshot.

## How

The HTML sections from the reference landing page were rebuilt as Tailwind components in `src/components/home/HomePage.tsx`. Shared motion lives in `AiField`, `Reveal`, and `BrandMark`. Login buttons dispatch `openAuthModal` instead of navigating away. `prefers-reduced-motion` turns the field and the entrance animations off.
