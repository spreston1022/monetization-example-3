## Monetization Example Gateway

A minimal Zuplo API gateway built on Zuplo's real **Monetization** feature
(meters, features/entitlements, plans, Stripe billing, and the
`monetization-inbound` policy) — not a hand-rolled API-key/metadata
substitute.

It shows three plans, each with its own rate limit, where one plan bundles
two APIs and the other two plans each get exactly one.

### The APIs

- **Shipping API** — `GET /v1/shipments` (mock data from `modules/logistics.ts`)
- **Delivery API** — `GET /v1/deliveries` (mock data from `modules/logistics.ts`)

### How an API gets tied to a plan

Each route runs the `monetization-inbound` policy (see
`config/policies.json`). It authenticates the API key, resolves the
caller's subscription, and — via the `requiredEntitlements` option — only
lets the request through if the subscription has access to that route's
feature:

| Route                | Policy instance                 | `requiredEntitlements`  |
| -------------------- | ------------------------------- | ----------------------- |
| `GET /v1/shipments`  | `monetization-shipping-inbound` | `["shipping_requests"]` |
| `GET /v1/deliveries` | `monetization-delivery-inbound` | `["delivery_requests"]` |

A plan gets access to an API by having the matching feature attached to it
in the Monetization service. This is what lets `gold` bundle both APIs
while `bronze`/`silver` are restricted to one each — no custom code, just
the entitlement each plan is subscribed to.

### Rate limiting per plan

Monetization's usage quotas are typically monthly, so per-second/per-minute
rate limiting is layered on separately at the gateway, per Zuplo's guidance:
a `rate-limit-inbound` policy with `rateLimitBy: "function"`, pointed at a
small custom module (`modules/rate-limit-by-plan.ts`) that reads the
resolved subscription's plan key and applies that plan's threshold:

```ts
const subscription = MonetizationInboundPolicy.getSubscriptionData(context);
const planKey = subscription?.plan.key;
```

Thresholds live in `modules/plans.ts`:

| Plan     | Rate limit          |
| -------- | -------------------- |
| `bronze` | 10 requests/minute   |
| `silver` | 20 requests/minute   |
| `gold`   | 50 requests/minute   |

(The numbers themselves are illustrative — swap in whatever your product
needs.)

### Set up the Monetization service (Portal)

The gateway code above assumes the following Monetization configuration.
Create it in **Services → Monetization** in the Zuplo Portal. The `key`
values must match the code exactly — meter key, feature key, and the key
used in the policy's `meters`/`requiredEntitlements` options all have to
line up (see the [naming convention docs](https://zuplo.com/docs/articles/monetization/meters#naming-consistency)).

1. **Meters** (Meters tab): create `shipping_requests` and `delivery_requests`
   (SUM aggregation, one event per request).
2. **Features** (Features tab): create `shipping_requests` and
   `delivery_requests`, each linked to the meter of the same key.
3. **Plans** (Plans tab):
   - `bronze` — attach the `shipping_requests` feature/entitlement only.
   - `silver` — attach the `delivery_requests` feature/entitlement only.
   - `gold` — attach **both** `shipping_requests` and `delivery_requests`.
   - Set whatever usage limit/pricing you want per plan — the exact
     numbers don't matter for this example.
   - Publish each plan once configured.
4. **Payment provider**: connect a Stripe **test/sandbox** key under
   **Services → Monetization → Payment Provider**. Free plans don't
   require a card on file unless you explicitly set
   `paymentMethodRequired: true` on the plan.

### Run it locally

```bash
npm install
npx zuplo link      # link this working copy to a Zuplo environment
npm run dev
```

The dev portal (with the monetization pricing page enabled via
`zuploMonetizationPlugin()` in `docs/zudoku.config.tsx`) is where customers
subscribe to a plan and get an API key issued automatically.

### Test it

Subscribe to each plan from the dev portal's pricing page, grab the
resulting API key, then:

```bash
# bronze: can call shipping...
curl http://localhost:9000/v1/shipments -H "Authorization: Bearer BRONZE_KEY"

# ...but not delivery (403 - missing 'delivery_requests' entitlement)
curl http://localhost:9000/v1/deliveries -H "Authorization: Bearer BRONZE_KEY"

# silver: the reverse
curl http://localhost:9000/v1/deliveries -H "Authorization: Bearer SILVER_KEY"
curl http://localhost:9000/v1/shipments -H "Authorization: Bearer SILVER_KEY"

# gold: both work, with a higher shared rate limit
curl http://localhost:9000/v1/shipments -H "Authorization: Bearer GOLD_KEY"
curl http://localhost:9000/v1/deliveries -H "Authorization: Bearer GOLD_KEY"
```

Send more than a plan's rate limit within the time window to see a `429
Too Many Requests`; call a route the plan isn't entitled to and see a
`403 Forbidden`.

### Learn more

- [Monetization quickstart](https://zuplo.com/docs/articles/monetization/quickstart)
- [Monetization policy reference](https://zuplo.com/docs/articles/monetization/monetization-policy)
- [Reading subscription data](https://zuplo.com/docs/articles/monetization/subscription-data)
- [Zuplo documentation](https://zuplo.com/docs)
