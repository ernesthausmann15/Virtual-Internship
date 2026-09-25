# feature/choose-plan

## What

`/choose-plan` offers Premium monthly and Premium Plus yearly. The yearly plan includes a 7-day trial. A billing toggle animates between the two prices, and an FAQ accordion sits under the card. The sidebar is hidden on this route.

## Why

Checkout has to be one screen with a clear price, and the trial belongs only on the yearly price. The Stripe Firebase extension expects the client to create a checkout session document rather than call Stripe directly.

## How

A Framer Motion `layoutId` slides the toggle pill. The displayed prices are $9.99 monthly and $99.99 yearly. `startStripeCheckout` writes `customers/{uid}/checkout_sessions` with `price`, `success_url`, `cancel_url`, and `allow_promotion_codes`. `trial_period_days: 7` is sent only for the yearly price. A snapshot listener waits for the extension to add `url`, then the browser goes there. Rules allow the owner to create that payload and block client edits. Subscription and payment documents are read-only because the extension writes them with the Admin SDK. The FAQ content follows the live Summarist pricing page.
