# Virtual Internship

A cinematic book-summary app modeled on [Summarist](https://summarist.vercel.app/). Read or listen to key ideas, save titles to a personal library, and subscribe with Stripe.

## Stack

Next.js, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion, Redux Toolkit, Firebase Auth and Firestore, Stripe through the Firebase extension, and Vercel.

## Scripts

```bash
npm install
npm run dev
npm run build
```

Open [http://localhost:3000](http://localhost:3000).

## Firebase and Stripe

1. Create a Firebase project and enable Email/Password and Google sign-in.
2. Copy `.env.example` to `.env.local` and fill in the web app config.
3. Create a guest user, or use **Continue as guest** (`guest@gmail.com` / `guest123`). The app creates that user on first guest login if it does not exist.
4. Deploy the prototype rules in `firestore.rules` after you review them.
5. Install the **Run Payments with Stripe** extension. Put the monthly and yearly Price IDs in `.env.local`. Yearly checkout requests a 7-day trial.

Auth config for the CLI lives in `firebase.json`. Deploy it only after `npx -y firebase-tools@latest use <project-id>`:

```bash
npx -y firebase-tools@latest deploy --only auth,firestore:rules
```

## Routes

| Path | What it does |
| --- | --- |
| `/` | Landing page. No sidebar. |
| `/for-you` | Selected, recommended, and suggested books. |
| `/book/[id]` | Metadata, Read / Listen gate, save to library. |
| `/player/[id]` | Audio controls and the summary. |
| `/library` | Books saved in Firestore. |
| `/choose-plan` | Monthly Premium and yearly Premium-Plus. No sidebar. |
| `/settings` | Email, plan, and upgrade links. |

Book covers morph between the feed, the detail page, and the player. Search waits 300ms before calling the API.

## Branches

Features were built on `feature/auth-modal`, `feature/home-page`, `feature/for-you-page`, `feature/book-detail`, `feature/player`, `feature/choose-plan`, and `feature/navigation-and-settings`, then merged back to `main`.

## Deploy on Vercel

The app builds with no Firebase or Stripe secrets. Missing env vars leave sign-in and checkout inactive; pages still render.

1. Import this GitHub repo in Vercel and leave the framework as Next.js. Production branch is `main`.
2. Optional environment variables (see `.env.example`): `NEXT_PUBLIC_FIREBASE_*` and the two Stripe price ids.
3. Deploy. `npm run build` is the production command Vercel runs.

Node 20 or newer is required (`engines` in `package.json`).
