import {
  CustomRateLimitDetails,
  MonetizationInboundPolicy,
  ZuploContext,
  ZuploRequest,
} from "@zuplo/runtime";
import { DEFAULT_RATE_LIMIT, PLAN_RATE_LIMITS } from "./plans";

/**
 * One rate-limit policy instance, shared by every monetized route, that
 * applies a different threshold depending on the caller's plan. Reads the
 * subscription that `monetization-inbound` (which must run earlier in the
 * pipeline) already resolved and stashed on the request context.
 */
export default function rateLimitByPlan(
  request: ZuploRequest,
  context: ZuploContext,
  policyName: string,
): CustomRateLimitDetails {
  const subscription = MonetizationInboundPolicy.getSubscriptionData(context);
  const planKey = subscription?.plan.key;
  const limits = (planKey && PLAN_RATE_LIMITS[planKey]) || DEFAULT_RATE_LIMIT;

  return {
    key: subscription?.id ?? request.user?.sub ?? "anonymous",
    requestsAllowed: limits.requestsAllowed,
    timeWindowMinutes: limits.timeWindowMinutes,
  };
}
