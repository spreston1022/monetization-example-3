/**
 * Single source of truth for the three plans in this example gateway.
 *
 * - bronze: access to the Posts API only
 * - silver: access to the Users API only
 * - gold:   bundles BOTH the Posts API and the Users API
 *
 * Each plan also gets its own rate limit, enforced by
 * modules/rate-limit-by-plan.ts.
 */

export type ApiName = "posts" | "users";
export type PlanName = "bronze" | "silver" | "gold";

export interface PlanConfig {
  apis: ApiName[];
  requestsAllowed: number;
  timeWindowMinutes: number;
}

export const PLANS: Record<PlanName, PlanConfig> = {
  bronze: { apis: ["posts"], requestsAllowed: 10, timeWindowMinutes: 1 },
  silver: { apis: ["users"], requestsAllowed: 20, timeWindowMinutes: 1 },
  gold: {
    apis: ["posts", "users"],
    requestsAllowed: 50,
    timeWindowMinutes: 1,
  },
};

export interface ConsumerMetadata {
  plan?: PlanName;
}
