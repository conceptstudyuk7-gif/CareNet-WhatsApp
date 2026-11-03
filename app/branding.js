import { getViteBase } from "../app-path.config.js";

/** Prefix a route or asset path with the app basename (e.g. /whatsapp). */
export function appPath(path) {
  const normalized = path.startsWith("/") ? path.slice(1) : path;
  const base = getViteBase();

  if (base === "/") {
    return `/${normalized}`;
  }

  return `${base}${normalized}`;
}

export const BRANDING = {
  logo: appPath("assets/carenet-solutions-logo.png"),
  company: "CareNetSolutions",
  appName: "CareNet WhatsApp",
  pageTitle: "WhatsApp Extension Setup",
  supportEmail: "support@carenetsolutions.com",
  privacyEmail: "privacy@carenetsolutions.com",
  privacyPath: appPath("privacy"),
  homePath: appPath(""),
  effectiveDate: "May 31, 2026",
  themeEmbedHandle: "whatsapp-floating-embed",
};
