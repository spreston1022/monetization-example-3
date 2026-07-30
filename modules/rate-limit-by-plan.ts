import {
  CustomRateLimitDetails,
  ZuploContext,
  ZuploRequest,
} from "@zuplo/runtime";
import { ConsumerMetadata, PLANS } from "./plans";

/**
 * One rate-limit policy instance, shared by every route, that applies a
 * different threshold depending on the caller's plan. The bucket key is the
 * consumer name, so a gold-plan consumer shares a single limit across both
 * bundled APIs.
 */
export default function rateLimitByPlan(
  request: ZuploRequest,
  context: ZuploContext,
  policyName: string,
): CustomRateLimitDetails {
  const metadata = request.user?.data as ConsumerMetadata | undefined;
  const plan = metadata?.plan ?? "bronze";
  const limits = PLANS[plan] ?? PLANS.bronze;

  return {
    key: request.user?.sub ?? "anonymous",
    requestsAllowed: limits.requestsAllowed,
    timeWindowMinutes: limits.timeWindowMinutes,
  };
}
