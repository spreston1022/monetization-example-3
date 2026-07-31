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
 * Monetization service. Note: a plan's `key` is locked once the plan is
 * published, so these map to whatever key each plan was actually created
 * with, not necessarily its display `name`.
 *
 *   key            -> name (display)
 *   fixed_quota    -> bronze
 *   fixed_quota_2  -> Silver
 *   fixed_quota_3  -> Gold
 */

export interface RateLimit {
  requestsAllowed: number;
  timeWindowMinutes: number;
}

export const PLAN_RATE_LIMITS: Record<string, RateLimit> = {
  fixed_quota: { requestsAllowed: 10, timeWindowMinutes: 1 }, // bronze
  fixed_quota_2: { requestsAllowed: 20, timeWindowMinutes: 1 }, // Silver
  fixed_quota_3: { requestsAllowed: 50, timeWindowMinutes: 1 }, // Gold
};

export const DEFAULT_RATE_LIMIT: RateLimit = PLAN_RATE_LIMITS.fixed_quota;
