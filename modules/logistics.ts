import { ZuploContext, ZuploRequest } from "@zuplo/runtime";

/**
 * Mock backends for the Shipping and Delivery APIs. They return static
 * sample data so the example runs without a real logistics service - swap
 * these for a `urlRewriteHandler` pointed at your own backend.
 */

export async function listShipments(
  request: ZuploRequest,
  context: ZuploContext,
) {
  return Response.json([
    {
      id: "shp_1001",
      carrier: "UPS",
      service: "Ground",
      origin: "Seattle, WA",
      destination: "Austin, TX",
      weightKg: 2.4,
      status: "label_created",
      createdAt: "2026-10-27T15:04:00Z",
    },
    {
      id: "shp_1002",
      carrier: "FedEx",
      service: "2Day",
      origin: "Seattle, WA",
      destination: "Denver, CO",
      weightKg: 0.8,
      status: "in_transit",
      createdAt: "2026-10-26T18:22:00Z",
    },
  ]);
}

export async function listDeliveries(
  request: ZuploRequest,
  context: ZuploContext,
) {
  return Response.json([
    {
      id: "dlv_2001",
      shipmentId: "shp_1002",
      status: "out_for_delivery",
      estimatedDelivery: "2026-10-29T20:00:00Z",
      lastLocation: "Denver, CO",
    },
    {
      id: "dlv_2002",
      shipmentId: "shp_0997",
      status: "delivered",
      deliveredAt: "2026-10-25T14:31:00Z",
      signedBy: "Front desk",
    },
  ]);
}
