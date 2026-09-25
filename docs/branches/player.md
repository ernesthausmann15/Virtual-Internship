# feature/player

## What changed

`/player/[id]` plays `audioLink` with play/pause, skip back and forward 10 seconds, a scrub bar, and the current time. An equalizer moves while audio is playing. The summary uses `white-space: pre-line` so the API’s line breaks stay intact. Opening with `?mode=listen` starts playback.

## Why

The capstone’s player is a custom control, not the browser’s default audio bar, and the summary has to stay readable beside it. The same access rules as the book page apply, so a direct link cannot skip the paywall.

## How

An `<audio>` element holds the file. A `requestAnimationFrame` loop updates the clock only while it is playing. The space bar toggles playback. The equalizer is CSS animation tied to the playing state. Web Audio analysis was skipped because the Firebase audio host does not send CORS headers that an analyser needs, and setting `crossOrigin` would stop playback. The page runs `decideAccess` again and either opens the auth dialog or replaces the route with `/choose-plan`.
