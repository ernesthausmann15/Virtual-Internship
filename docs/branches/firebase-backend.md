# feature/firebase-backend

## What

The app talks to Firebase project `virtual-internship-b25d1`. Email and password and Google sign-in are enabled. The login dialog can request an SMS code. Firestore is an enterprise database named `virtual-internship-app` in `nam5`.

## Why

Sign-in, the saved library, and the subscription listener were already written against Firebase, but they had no project, so every attempt stopped before it reached a backend.

## How

`apps:sdkconfig` supplied the public web config. `src/lib/firebase.ts` uses that config, and environment variables can still override it. Firestore is opened with `getFirestore(app, "virtual-internship-app")` because an enterprise database cannot use the id `(default)`. Listeners stay on `onSnapshot` because the shelf, the checkout URL, and the plan have to update live. `firebase deploy --only auth` turned on email/password and Google. The Phone provider still has to be enabled in the Firebase console.
