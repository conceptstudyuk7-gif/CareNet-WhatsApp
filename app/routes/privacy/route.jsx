import { BRANDING } from "../../branding.js";
import styles from "./styles.module.css";

export const meta = () => [
  { title: `Privacy Policy — ${BRANDING.company}` },
  {
    name: "description",
    content: `Privacy Policy for ${BRANDING.appName} by ${BRANDING.company}.`,
  },
];

export default function PrivacyPolicy() {
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
          <h1 className={styles.title}>Privacy Policy</h1>
          <p className={styles.subtitle}>
            {BRANDING.appName} · Effective date: {BRANDING.effectiveDate}
          </p>
        </header>

        <article className={styles.card}>
          <div className={styles.cardAccent} aria-hidden="true" />
          <div className={styles.body}>
            <div className={styles.callout}>
              This Privacy Policy explains how {BRANDING.company} (&quot;we,&quot;
              &quot;us,&quot; or &quot;our&quot;) collects, uses, and protects
              information when you install or use the {BRANDING.appName} Shopify
              application (the &quot;App&quot;).
            </div>

            <h2>1. Who we are</h2>
            <p>
              The App is provided by <strong>{BRANDING.company}</strong>. The App
              adds a floating WhatsApp chat button to a merchant&apos;s Shopify
              storefront and provides an admin dashboard to configure that button.
            </p>
            <p>
              This policy applies to merchants who install the App on their
              Shopify store. It does not create a direct relationship between{" "}
              {BRANDING.company} and a merchant&apos;s customers who visit the
              storefront.
            </p>

            <h2>2. Information we collect</h2>
            <p>
              We collect only the information needed to operate, secure, and
              support the App.
            </p>

            <h2>2.1 Merchant and shop information</h2>
            <p>When you install or use the App, we may process:</p>
            <ul>
              <li>Your Shopify store domain (for example, <code>example.myshopify.com</code>)</li>
              <li>OAuth session and authentication data required to connect the App to your store</li>
              <li>Shopify API access tokens associated with your installation</li>
              <li>
                Basic Shopify staff account details provided through Shopify during
                installation or use (such as name, email address, and user ID), if
                available from Shopify
              </li>
              <li>App permissions (API scopes) granted during installation</li>
            </ul>

            <h2>2.2 App settings you provide</h2>
            <p>
              When you configure the App, we store the settings you enter in the
              dashboard, including:
            </p>
            <ul>
              <li>WhatsApp country code and phone number</li>
              <li>Default WhatsApp message</li>
              <li>Button label (accessibility text)</li>
              <li>Whether the WhatsApp button is enabled or hidden</li>
            </ul>
            <p>
              These settings are stored as app installation metafields in your
              Shopify store so the storefront button can display the correct
              information.
            </p>

            <h2>2.3 Technical and operational data</h2>
            <p>We may automatically collect limited technical information such as:</p>
            <ul>
              <li>Server logs (for example, request timestamps, IP address, and error logs)</li>
              <li>Webhook delivery events related to app installation, uninstallation, or scope updates</li>
            </ul>

            <h2>3. Information we do not collect</h2>
            <p>The App is designed to minimize data collection. We do not:</p>
            <ul>
              <li>Collect or store personal information about your storefront customers</li>
              <li>Read, store, or monitor WhatsApp conversations or message content</li>
              <li>Collect customer order, payment, or checkout data through this App</li>
              <li>Track customers across websites for advertising purposes</li>
              <li>Send automated WhatsApp messages on your behalf</li>
            </ul>

            <h2>4. How we use information</h2>
            <p>We use the information described above to:</p>
            <ul>
              <li>Install, authenticate, and operate the App</li>
              <li>Save and display your WhatsApp button settings on your storefront</li>
              <li>Maintain app security and prevent misuse</li>
              <li>Respond to support requests and troubleshoot issues</li>
              <li>Comply with legal obligations and enforce our terms</li>
              <li>Improve the reliability and performance of the App</li>
            </ul>

            <h2>5. Legal basis for processing (EEA/UK merchants)</h2>
            <p>
              If you are located in the European Economic Area or the United
              Kingdom, we process personal data on the following bases:
            </p>
            <ul>
              <li>
                <strong>Contract:</strong> to provide the App and features you
                request
              </li>
              <li>
                <strong>Legitimate interests:</strong> to secure, maintain, and
                improve the App
              </li>
              <li>
                <strong>Legal obligation:</strong> where required by applicable law
              </li>
            </ul>

            <h2>6. How information is shared</h2>
            <p>We do not sell your personal information. We may share information with:</p>
            <ul>
              <li>
                <strong>Shopify:</strong> to install, host, and operate the embedded
                app within your Shopify admin and store
              </li>
              <li>
                <strong>Hosting and infrastructure providers:</strong> to run the
                App, store session data, and deliver web requests
              </li>
              <li>
                <strong>Meta / WhatsApp:</strong> only indirectly, when a visitor
                on your storefront clicks the WhatsApp button and is redirected to
                WhatsApp. We do not transmit customer data to Meta through that
                click.
              </li>
              <li>
                <strong>Legal and safety recipients:</strong> if required by law,
                court order, or to protect rights, safety, and security
              </li>
            </ul>

            <h2>7. Storefront visitors and WhatsApp</h2>
            <p>
              The App displays a WhatsApp link on your storefront using the phone
              number and message you configure. When a visitor clicks the button,
              they leave your store and open WhatsApp (a third-party service
              operated by Meta).
            </p>
            <p>
              Meta&apos;s own terms and privacy policy apply to any use of
              WhatsApp. You, as the merchant, are responsible for ensuring your use
              of WhatsApp complies with applicable laws and Meta&apos;s policies.
            </p>

            <h2>8. Data retention</h2>
            <p>We retain information only as long as necessary for the purposes above:</p>
            <ul>
              <li>
                <strong>Session and authentication data:</strong> retained while
                the App is installed and for a limited period needed for security
                and operations
              </li>
              <li>
                <strong>App settings:</strong> stored in your Shopify store
                metafields until you change or remove them, or uninstall the App
              </li>
              <li>
                <strong>After uninstall:</strong> when you uninstall the App, we
                delete associated shop session data from our database. Shopify may
                retain metafields according to its own policies until removed.
              </li>
            </ul>

            <h2>9. Security</h2>
            <p>
              We use reasonable administrative, technical, and organizational
              measures to protect information, including encrypted connections
              (HTTPS), access controls, and secure storage of session credentials.
              No method of transmission or storage is completely secure, and we
              cannot guarantee absolute security.
            </p>

            <h2>10. International data transfers</h2>
            <p>
              Your information may be processed in countries other than your own,
              including where our hosting providers operate. Where required, we
              rely on appropriate safeguards for cross-border transfers.
            </p>

            <h2>11. Your rights</h2>
            <p>
              Depending on your location, you may have rights to access, correct,
              delete, restrict, or object to certain processing of your personal
              information, and to data portability or withdrawal of consent where
              applicable.
            </p>
            <p>
              To exercise these rights, contact us using the details below. You
              may also have the right to lodge a complaint with your local data
              protection authority.
            </p>

            <h2>12. Merchant responsibilities</h2>
            <p>As a merchant using the App, you are responsible for:</p>
            <ul>
              <li>Providing a WhatsApp number you own or are authorized to use</li>
              <li>
                Ensuring your storefront privacy notices accurately describe how
                you communicate with customers
              </li>
              <li>Complying with applicable privacy, marketing, and consumer laws</li>
              <li>Complying with WhatsApp and Meta platform policies</li>
            </ul>

            <h2>13. Children&apos;s privacy</h2>
            <p>
              The App is intended for use by businesses and is not directed to
              children. We do not knowingly collect personal information from
              children.
            </p>

            <h2>14. Changes to this policy</h2>
            <p>
              We may update this Privacy Policy from time to time. When we do, we
              will revise the effective date at the top of this page. Material
              changes may also be communicated through the App or by other
              reasonable means.
            </p>

            <h2>15. Contact us</h2>
            <div className={styles.contactBox}>
              <p>
                If you have questions about this Privacy Policy or our data
                practices, contact:
              </p>
              <p className={styles.contactDetails}>
                <strong>{BRANDING.company}</strong>
                <br />
                Privacy:{" "}
                <a href={`mailto:${BRANDING.privacyEmail}`}>
                  {BRANDING.privacyEmail}
                </a>
                <br />
                Support:{" "}
                <a href={`mailto:${BRANDING.supportEmail}`}>
                  {BRANDING.supportEmail}
                </a>
              </p>
            </div>
          </div>
        </article>

        <p className={styles.footer}>
          © {new Date().getFullYear()} {BRANDING.company} · {BRANDING.appName}
        </p>
      </div>
    </div>
  );
}
