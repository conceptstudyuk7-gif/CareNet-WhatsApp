import crypto from "node:crypto";
import db from "../db.server";

// Mandatory Shopify compliance webhooks:
//   customers/data_request, customers/redact, shop/redact
//
// The HMAC signature is verified by hand on the raw request body, so an
// invalid or missing signature ALWAYS gets 401 (what Shopify's automated
// "Verifies webhooks with HMAC signatures" check expects), and a valid one
// gets 200.

function hasValidHmac(rawBody, headerHmac) {
  const secret = process.env.SHOPIFY_API_SECRET;
  if (!secret || !headerHmac) return false;

  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody, "utf8")
    .digest();
  const received = Buffer.from(headerHmac, "base64");

  return (
    received.length === expected.length &&
    crypto.timingSafeEqual(received, expected)
  );
}

export const loader = async () => new Response(null, { status: 405 });

export const action = async ({ request }) => {
  if (request.method !== "POST") {
    return new Response(null, { status: 405 });
  }

  if (!process.env.SHOPIFY_API_SECRET) {
    console.error("SHOPIFY_API_SECRET is not set; cannot verify webhooks.");
    return new Response("Server misconfigured", { status: 500 });
  }

  // Must be the exact raw body Shopify signed.
  const rawBody = await request.text();

  if (!hasValidHmac(rawBody, request.headers.get("X-Shopify-Hmac-Sha256"))) {
    return new Response("Unauthorized", { status: 401 });
  }

  const topic = (request.headers.get("X-Shopify-Topic") || "").toLowerCase();
  const shop = request.headers.get("X-Shopify-Shop-Domain") || "";

  switch (topic) {
    case "customers/data_request":
      console.log(`Compliance ${topic} for ${shop} - no customer data stored`);
      break;

    case "customers/redact":
      console.log(`Compliance ${topic} for ${shop} - no customer data to redact`);
      break;

    case "shop/redact":
      console.log(`Compliance ${topic} for ${shop} - deleting shop data`);
      if (shop) {
        await db.session.deleteMany({ where: { shop } });
      }
      break;

    default:
      console.log(`Unhandled compliance webhook topic "${topic}" for ${shop}`);
  }

  return new Response(null, { status: 200 });
};
