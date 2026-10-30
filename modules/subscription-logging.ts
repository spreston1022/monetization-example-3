import {
  MonetizationInboundPolicy,
  ZuploContext,
  ZuploRequest,
} from "@zuplo/runtime";

/**
 * Metered features whose monthly allowance is logged as `<key>_used` and
 * `<key>_remaining`. Only features on the caller's plan are logged.
 */
const QUOTA_FEATURES = ["shipping_requests", "delivery_requests"];

/**
 * Tags each request's logs with who made the call and which subscription and
 * plan it was billed against, then writes one summary line per request.
 *
 * Runs as a final response hook so it also covers requests that the
 * monetization or rate-limit policies rejected (401, 403, 429). Fields are
 * left out when they aren't known, e.g. there's no `sub` for a missing or
 * invalid API key, and no subscription for a key without one.
 */
export function logSubscription(
  response: Response,
  request: ZuploRequest,
  context: ZuploContext,
) {
  const subscription = MonetizationInboundPolicy.getSubscriptionData(context);

  const properties: Record<string, string | number> = {};
  if (request.user?.sub) properties.sub = request.user.sub;
  if (subscription) {
    properties.subscriptionId = subscription.id;
    properties.customerId = subscription.customerId;
    properties.planKey = subscription.plan.key;
    properties.planName = subscription.plan.name;
    properties.planVersion = subscription.plan.version;

    for (const key of QUOTA_FEATURES) {
      const entitlement = subscription.entitlements[key];
      if (!entitlement?.hasAccess) continue;
      properties[`${key}_used`] = entitlement.usage;
      properties[`${key}_remaining`] = entitlement.balance;
    }
  }

  context.log.setLogProperties?.(properties);
  context.log.info({
    message: "Request completed",
    method: request.method,
    path: new URL(request.url).pathname,
    status: response.status,
    ...properties,
  });
}
