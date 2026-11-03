const ASSET_PATH =
  /\.(?:js|css|map|png|jpe?g|gif|svg|webp|ico|woff2?|ttf)(?:\?|$)/i;

function requestUrl(input) {
  if (typeof input === "string") return input;
  if (input instanceof URL) return input.href;
  if (typeof Request !== "undefined" && input instanceof Request) return input.url;
  return "";
}

function shouldAttachSessionToken(input) {
  const raw = requestUrl(input);
  if (!raw) return false;

  let url;
  try {
    url = new URL(raw, window.location.origin);
  } catch {
    return false;
  }

  if (url.origin !== window.location.origin) return false;
  if (ASSET_PATH.test(url.pathname)) return false;
  return true;
}

async function readSessionToken() {
  const shopify = window.shopify;
  if (!shopify || typeof shopify.idToken !== "function") return null;

  try {
    return await shopify.idToken();
  } catch {
    return null;
  }
}

export function installSessionTokenFetch() {
  if (
    typeof window === "undefined" ||
    typeof window.fetch !== "function" ||
    window.__shopifySessionTokenFetch
  ) {
    return;
  }
  window.__shopifySessionTokenFetch = true;

  const appBridgeFetch = window.fetch.bind(window);
  let readingToken = false;

  window.fetch = async (input, init) => {
    if (readingToken || !shouldAttachSessionToken(input)) {
      return appBridgeFetch(input, init);
    }

    const headers = new Headers(
      init?.headers ??
        (typeof Request !== "undefined" && input instanceof Request
          ? input.headers
          : undefined),
    );

    if (!headers.has("Authorization")) {
      const previousFetch = window.fetch;
      window.fetch = appBridgeFetch;
      readingToken = true;
      try {
        const token = await readSessionToken();
        if (token) headers.set("Authorization", `Bearer ${token}`);
      } finally {
        readingToken = false;
        window.fetch = previousFetch;
      }
    }

    if (typeof Request !== "undefined" && input instanceof Request) {
      return appBridgeFetch(new Request(input, { headers }));
    }

    return appBridgeFetch(input, { ...init, headers });
  };
}

if (typeof window !== "undefined") {
  installSessionTokenFetch();
}
