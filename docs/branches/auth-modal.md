# feature/auth-modal

## What

A single sign-in dialog is available from anywhere in the app. It supports email and password, Google, a guest account, and password reset. The signed-in user and their plan live in Redux.

## Why

Login, premium books, the sidebar, and pricing all need the same prompt. One dialog means those screens do not each invent their own form, and the rest of the app can ask “is someone signed in?” from one place.

## How

`uiSlice` holds whether the dialog is open and whether it is login, register, or reset. `AuthModal` is mounted once in the root layout and reads that state. `src/lib/auth.ts` calls Firebase: register and login check a real email and a password of at least 6 characters, Google uses a popup, and guest login (`guest@gmail.com` / `guest123`) creates the user the first time. `AuthListener` subscribes to `onAuthStateChanged` and to `customers/{uid}/subscriptions`, then writes the user and the plan (`basic`, `premium`, or `premium-plus`) into the store. If Firebase env vars are missing, auth starts as logged out so the page does not flash a loading skeleton.
