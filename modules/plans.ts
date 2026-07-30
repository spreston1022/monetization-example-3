/**
 * Gateway-layer rate limits for each plan configured in the Monetization
 * service (Services -> Monetization -> Plans in the Zuplo Portal).
 *
 * Which APIs a plan can call is NOT decided here - that's declared on the
 * plan itself in the Monetization service (via the entitlements/features
 * attached to it) and enforced by `requiredEntitlements` on the
 * monetization-inbound policy in config/policies.json. This file only
 * covers the per-second/per-minute spike-protection limit layered on top,
 * since Monetization's usage quotas are monthly, not per-minute.
 *
 * Plan keys here must match the plan `key` values you create in the
 * Monetization service.
 */

export interface RateLimit {
  requestsAllowed: number;
  timeWindowMinutes: number;
}

export const PLAN_RATE_LIMITS: Record<string, RateLimit> = {
  bronze: { requestsAllowed: 10, timeWindowMinutes: 1 },
  silver: { requestsAllowed: 20, timeWindowMinutes: 1 },
  gold: { requestsAllowed: 50, timeWindowMinutes: 1 },
};

export const DEFAULT_RATE_LIMIT: RateLimit = PLAN_RATE_LIMITS.bronze;
