# feature/ai-homepage

## What changed

The landing hero now leads with a large animated mark instead of the static illustration. Three rings orbit at different speeds around a navy “VI” core, a neural field sits inside the circle, and the whole mark tilts toward the pointer. On a phone the mark appears above the headline so it is the first thing on screen.

## Why

The earlier homepage already had motion in the background, but the main image was a still PNG. A mark that reacts to the pointer gives the first screen something to do with, which is the interaction people remember.

## How

`src/components/brand/AiLogo.tsx` draws the rings with Framer Motion and reuses `AiField` for the network inside the core. Pointer movement maps to a small rotateX / rotateY spring. `prefers-reduced-motion` stops the orbits, the float, and the tilt. `HomePage` places that component in the hero and drops the floating `landing.png`.
