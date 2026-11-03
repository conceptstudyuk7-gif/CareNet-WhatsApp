import { redirect } from "react-router";
import { BRANDING } from "../../branding.js";
import styles from "./styles.module.css";

export const meta = () => [
  { title: `${BRANDING.appName} — ${BRANDING.company}` },
  {
    name: "description",
    content:
      "Install CareNet WhatsApp from Shopify Admin to add a floating WhatsApp chat button to your store.",
  },
];

export const loader = async ({ request }) => {
  const url = new URL(request.url);

  if (url.searchParams.get("shop")) {
    throw redirect(`/app?${url.searchParams.toString()}`);
  }

  return null;
};

export default function AppLanding() {
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
          <p className={styles.subtitle}>
            Add a floating WhatsApp chat button to your Shopify store. Manage
            your number, default message, and button visibility from one
            dashboard.
          </p>
        </header>

        <div className={styles.card}>
          <div className={styles.cardAccent} aria-hidden="true" />
          <div className={styles.body}>
            <h2 className={styles.cardTitle}>Install from Shopify Admin</h2>
            <p className={styles.cardText}>
              This app must be installed from Shopify. Open your Shopify Admin,
              go to <strong>Apps</strong>, and install or open{" "}
              <strong>{BRANDING.appName}</strong> from the Shopify App Store or
              your app install link.
            </p>
            <ol className={styles.steps}>
              <li>Open Shopify Admin → <strong>Apps</strong></li>
              <li>Search for <strong>{BRANDING.appName}</strong></li>
              <li>Click <strong>Install</strong> and approve permissions</li>
              <li>Configure your WhatsApp settings in the app dashboard</li>
            </ol>

            <ul className={styles.features}>
              <li>
                <strong>Floating WhatsApp button</strong> on all store pages
              </li>
              <li>
                <strong>Central dashboard</strong> for number, message, and
                on/off control
              </li>
              <li>
                <strong>One-time setup</strong> via Theme → App embeds
              </li>
            </ul>
          </div>
        </div>

        <footer className={styles.footer}>
          <p>
            © {new Date().getFullYear()} {BRANDING.company}
          </p>
          <a className={styles.footerLink} href={BRANDING.privacyPath}>
            Privacy Policy
          </a>
        </footer>
      </div>
    </div>
  );
}
