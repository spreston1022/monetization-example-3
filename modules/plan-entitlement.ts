import { ZuploContext, ZuploRequest, HttpProblems } from "@zuplo/runtime";
import { ApiName, ConsumerMetadata, PLANS } from "./plans";

interface PlanEntitlementOptions {
  api: ApiName;
}

/**
 * Rejects the request unless the caller's plan (set on the API key
 * consumer's metadata) includes the API this route belongs to. This is what
 * lets the "gold" plan bundle both APIs while "bronze"/"silver" each get one.
 */
export default async function planEntitlement(
  request: ZuploRequest,
  context: ZuploContext,
  options: PlanEntitlementOptions,
): Promise<ZuploRequest | Response> {
  const metadata = request.user?.data as ConsumerMetadata | undefined;
  const plan = metadata?.plan;
  const allowedApis = plan ? PLANS[plan]?.apis : undefined;

  if (!allowedApis || !allowedApis.includes(options.api)) {
    return HttpProblems.forbidden(request, context, {
      detail: plan
        ? `Your plan '${plan}' does not include access to the '${options.api}' API.`
        : "No plan found on this API key's metadata.",
    });
  }

  return request;
}
