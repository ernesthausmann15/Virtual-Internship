# feature/ai-homepage

## What

The landing hero leads with a large animated mark. Three rings orbit at different speeds around an “S” core, a neural field sits inside the circle, and the mark tilts toward the pointer. On a phone the mark appears above the headline.

## Why

The first screen should give someone something to do. A mark that leans with the pointer is the interaction people remember from the visit.

## How

`src/components/brand/AiLogo.tsx` draws the rings with Framer Motion and reuses `AiField` for the network inside the core. Pointer movement maps to a small rotateX / rotateY spring. `prefers-reduced-motion` stops the orbits, the float, and the tilt. `HomePage` places that component in the hero.
