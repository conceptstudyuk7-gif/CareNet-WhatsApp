/** Shared subpath config when app is hosted under a URL path (e.g. /whatsapp). */
export function getAppBasename() {
  const url = process.env.SHOPIFY_APP_URL || "http://localhost:3000";

  try {
    const pathname = new URL(url).pathname.replace(/\/$/, "");
    return pathname || "/";
  } catch {
    return "/";
  }
}

export function getViteBase() {
  const basename = getAppBasename();
  return basename === "/" ? "/" : `${basename}/`;
}
