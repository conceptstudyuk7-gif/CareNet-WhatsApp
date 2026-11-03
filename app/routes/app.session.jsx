import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);

  return Response.json(
    { authenticated: true },
    { headers: { "Cache-Control": "private, no-store" } },
  );
};

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
