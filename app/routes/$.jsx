import { BRANDING } from "../branding.js";
import styles from "../styles/not-found.module.css";

export const meta = () => [
  { title: `Page not found — ${BRANDING.appName}` },
];

export default function NotFound() {
  return (
    <div className={styles.page}>
      <div className={styles.wrap}>
        <h1 className={styles.title}>Page not found</h1>
        <p className={styles.text}>
          The page you requested does not exist or is not available.
        </p>
        <a className={styles.link} href={BRANDING.homePath}>
          Go to app home
        </a>
      </div>
    </div>
  );
}
