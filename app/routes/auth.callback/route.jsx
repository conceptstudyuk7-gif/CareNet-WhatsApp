import { data, useLoaderData } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../../shopify.server";
import { BRANDING } from "../../branding.js";
import styles from "./styles.module.css";

function hasOAuthParams(url) {
  return (
    url.searchParams.get("shop") &&
    url.searchParams.get("code") &&
    url.searchParams.get("state")
  );
}

export const meta = () => [
  { title: `Authorization — ${BRANDING.appName}` },
];

export const loader = async ({ request }) => {
  const url = new URL(request.url);

  if (!hasOAuthParams(url)) {
    return data({ invalid: true }, { status: 400 });
  }

  await authenticate.admin(request);

  return null;
};

export default function AuthCallback() {
  const loaderData = useLoaderData();

  if (!loaderData?.invalid) {
    return null;
  }

  return (
    <div className={styles.page}>
      <div className={styles.wrap}>
        <header className={styles.header}>
          <img
            src={BRANDING.logo}
            alt={`${BRANDING.company} logo`}
            className={styles.logo}
          />
          <span className={styles.eyebrow}>{BRANDING.company}</span>
          <h1 className={styles.title}>{BRANDING.appName}</h1>
        </header>

        <div className={styles.card}>
          <div className={styles.cardAccent} aria-hidden="true" />
          <div className={styles.body}>
            <div className={styles.errorIcon} aria-hidden="true">
              !
            </div>
            <h2 className={styles.errorTitle}>Invalid authorization request.</h2>
            <p className={styles.errorText}>
              Please install the app from Shopify Admin.
            </p>
            <p className={styles.helpText}>
              Open your store in Shopify Admin, go to <strong>Apps</strong>, and
              open or install {BRANDING.appName}. Do not open this callback URL
              directly in your browser.
            </p>
            <a className={styles.link} href={BRANDING.homePath}>
              Go to app home
            </a>
          </div>
        </div>

        <footer className={styles.footer}>
          <p>
            © {new Date().getFullYear()} {BRANDING.company}
          </p>
        </footer>
      </div>
    </div>
  );
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
