## Monetization Example Gateway

A minimal Zuplo API gateway showing how to run three subscription plans,
each with its own rate limit, where one plan bundles two APIs and the
others get exactly one.

### The APIs

- **Posts API** — `GET /v1/posts` (proxies to a public demo backend)
- **Users API** — `GET /v1/users` (proxies to a public demo backend)

### The plans

Plans are just a `plan` field stored on an API key consumer's metadata
(see `modules/plans.ts`). The actual dollar thresholds don't matter here —
this is meant to demonstrate the pattern, not real pricing.

| Plan     | APIs included | Rate limit         |
| -------- | -------------- | ------------------- |
| `bronze` | Posts only     | 10 requests/minute  |
| `silver` | Users only     | 20 requests/minute  |
| `gold`   | Posts + Users  | 50 requests/minute  |

Two things enforce this per request:

1. **`modules/plan-entitlement.ts`** — a custom inbound policy on each route
   that checks whether the caller's plan includes that route's API, and
   returns a `403` if not. This is what lets `gold` bundle both APIs while
   `bronze`/`silver` are restricted to one each.
2. **`modules/rate-limit-by-plan.ts`** — a custom rate-limit key function
   that looks up the caller's plan and applies that plan's
   `requestsAllowed`/`timeWindowMinutes`, all from a single
   `rate-limit-by-plan-inbound` policy instance shared by both routes.

Both read `request.user.data.plan`, which is populated by the API Key
Authentication policy from the consumer's metadata.

### Try it locally

```bash
npm install
npm run dev
```

This starts the gateway at `http://localhost:9000`. Rate limiting needs a
linked Zuplo environment to enforce (it uses a distributed counter
service), so run `npx zuplo link` once and pick/create an environment.

### Create a consumer for each plan

In the [Zuplo Portal](https://portal.zuplo.com) under **Services → API Key
Service → Consumers**, create one consumer per plan with the matching
metadata, e.g.:

```json
{ "plan": "bronze" }
```

```json
{ "plan": "silver" }
```

```json
{ "plan": "gold" }
```

Copy each consumer's API key.

### Test it

```bash
# bronze: can call posts...
curl http://localhost:9000/v1/posts -H "Authorization: Bearer BRONZE_KEY"

# ...but not users (403)
curl http://localhost:9000/v1/users -H "Authorization: Bearer BRONZE_KEY"

# silver: the reverse
curl http://localhost:9000/v1/users -H "Authorization: Bearer SILVER_KEY"
curl http://localhost:9000/v1/posts -H "Authorization: Bearer SILVER_KEY"

# gold: both work, with a higher shared rate limit
curl http://localhost:9000/v1/posts -H "Authorization: Bearer GOLD_KEY"
curl http://localhost:9000/v1/users -H "Authorization: Bearer GOLD_KEY"
```

Send more than a plan's `requestsAllowed` within the time window to see a
`429 Too Many Requests` response.

### Learn more

To learn more about Zuplo, visit the
[Zuplo documentation](https://zuplo.com/docs).
