import { Links, Meta, Outlet, Scripts, ScrollRestoration, isRouteErrorResponse, useLoaderData, useRouteError } from "react-router";
import { BRANDING } from "./branding.js";

export const loader = () => {
  return { apiKey: process.env.SHOPIFY_API_KEY || "" };
};

export default function App() {
  const { apiKey } = useLoaderData();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="shopify-api-key" content={apiKey} />
        <script src="https://cdn.shopify.com/shopifycloud/app-bridge.js"></script>
        <link rel="preconnect" href="https://cdn.shopify.com/" />
        <link
          rel="stylesheet"
          href="https://cdn.shopify.com/static/fonts/inter/v4/styles.css"
        />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : "Unexpected error";

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>Error — {BRANDING.appName}</title>
      </head>
      <body
        style={{
          fontFamily: "Inter, Arial, sans-serif",
          background: "#f4f6f8",
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          padding: "24px",
        }}
      >
        <main style={{ maxWidth: "480px", textAlign: "center" }}>
          <h1 style={{ marginBottom: "12px" }}>Something went wrong</h1>
          <p style={{ color: "#4b5563", lineHeight: 1.6 }}>{message}</p>
          <p style={{ marginTop: "20px" }}>
            <a href={BRANDING.homePath} style={{ color: "#128c7e", fontWeight: 700 }}>
              Go to app home
            </a>
          </p>
        </main>
      </body>
    </html>
  );
}
