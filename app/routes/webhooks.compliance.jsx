import { authenticate } from "../shopify.server";
import db from "../db.server";

async function deleteShopData(shop) {
  await db.session.deleteMany({ where: { shop } });
}

export const loader = async ({ request }) => {
  if (request.method === "GET") {
    return new Response(null, { status: 405 });
  }

  return new Response(null, { status: 405 });
};

export const action = async ({ request }) => {
  const { shop, topic, payload } = await authenticate.webhook(request);

  switch (topic) {
    case "CUSTOMERS_DATA_REQUEST":
      console.log(
        `Compliance webhook ${topic} for ${shop} — no customer data stored`,
        payload?.customer?.id ?? "unknown customer",
      );
      break;

    case "CUSTOMERS_REDACT":
      console.log(
        `Compliance webhook ${topic} for ${shop} — no customer data to redact`,
        payload?.customer?.id ?? "unknown customer",
      );
      break;

    case "SHOP_REDACT":
      console.log(`Compliance webhook ${topic} for ${shop} — deleting shop data`);
      await deleteShopData(shop);
      break;

    default:
      console.log(`Unhandled compliance webhook topic: ${topic} for ${shop}`);
  }

  return new Response(null, { status: 200 });
};
