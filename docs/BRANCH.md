# feature/firebase-backend

## What changed

The app now talks to Firebase project `virtual-internship-b25d1`. Email/password and Google sign-in are enabled. The login dialog can also request an SMS code. Firestore is an enterprise database named `virtual-internship-app` in `nam5`, and the existing library and checkout rules are published there.

## Why

Sign-in, the saved library, and the subscription listener were already written against Firebase, but they had no project config, so every attempt stopped before it reached a backend.

## How

`apps:sdkconfig` supplied the public web config. `src/lib/firebase.ts` uses that config (env vars can still override it) and opens Firestore with `getFirestore(app, "virtual-internship-app")`. The named database is required because an enterprise database cannot use the id `(default)`. Listeners stay on `onSnapshot` because the shelf, the checkout URL, and the plan all have to update live. `firebase deploy --only auth` turned on email/password and Google. Phone sign-in is in the client. The CLI cannot enable the Phone provider, so that switch still has to be turned on under Authentication, Sign-in method. The first database the CLI created had realtime updates off, so it was replaced with one that has Firestore data access and realtime updates on.
