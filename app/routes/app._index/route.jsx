import { useEffect, useState } from "react";
import { useFetcher, useLoaderData } from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../../shopify.server";
import {
  getCountryOptions,
  splitStoredPhoneNumber,
} from "../../country-codes.js";
import { CountryCodeSelect } from "./country-code-select.jsx";
import styles from "./styles.module.css";
import { BRANDING } from "../../branding.js";

const APP_LOGO = BRANDING.logo;

function WhatsAppIcon({ size = 28 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.52 3.48A11.86 11.86 0 0 0 12.07 0C5.5 0 .16 5.35.16 11.92c0 2.1.55 4.16 1.59 5.98L0 24l6.29-1.65a11.9 11.9 0 0 0 5.78 1.48h.01c6.57 0 11.92-5.35 11.92-11.92 0-3.18-1.24-6.16-3.48-8.43Zm-8.45 18.33h-.01a9.95 9.95 0 0 1-5.07-1.39l-.36-.21-3.73.98 1-3.64-.23-.37a9.92 9.92 0 0 1-1.53-5.27c0-5.48 4.46-9.94 9.94-9.94 2.65 0 5.13 1.03 7 2.9a9.83 9.83 0 0 1 2.91 7.01c0 5.48-4.46 9.94-9.93 9.94Zm5.45-7.44c-.3-.15-1.79-.88-2.07-.98-.28-.1-.48-.15-.69.15-.2.3-.79.98-.96 1.18-.18.2-.35.22-.65.08-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.03-.53-.08-.15-.69-1.66-.95-2.28-.25-.6-.5-.52-.69-.53l-.58-.01c-.2 0-.53.08-.8.38-.28.3-1.05 1.03-1.05 2.5s1.08 2.9 1.23 3.1c.15.2 2.12 3.24 5.14 4.54.72.31 1.29.5 1.73.64.73.23 1.4.2 1.93.12.59-.09 1.79-.73 2.04-1.44.25-.71.25-1.31.18-1.44-.08-.13-.28-.2-.58-.35Z" />
    </svg>
  );
}

const SETUP_STEPS = [
  <>
    Fill in the country, phone number, message, and label above, then click{" "}
    <strong>Save settings</strong>.
  </>,
  <>
    Go to Shopify Admin → <strong>Online Store</strong> →{" "}
    <strong>Themes</strong> → <strong>Customize</strong>.
  </>,
  <>
    If you previously added a WhatsApp block inside a page section, remove it
    first.
  </>,
  <>
    Open <strong>App embeds</strong> (puzzle icon) on the left sidebar.
  </>,
  <>
    Turn <strong>WhatsApp Floating Button</strong> ON and click Save. The button
    will appear on all store pages.
  </>,
  <>
    Use <strong>Keep WhatsApp button enabled</strong> to show or hide the button
    on your store without removing the app embed.
  </>,
  <>
    To update the number or message later, change them here in the app dashboard
    only.
  </>,
];

function formatPreviewPhone(countryCode, localPhone) {
  const code = normalizeDigits(countryCode);
  const local = normalizeDigits(localPhone);
  if (!code || !local) return "Not configured";
  return `+${code} ${local}`;
}

function StorePreview({ preview }) {
  const phone = formatPreviewPhone(preview.countryCode, preview.localPhone);
  const enabled = preview.enabled;

  return (
    <aside className={styles.previewColumn}>
      <div className={styles.previewCard}>
        <div className={styles.previewHeader}>
          <h3 className={styles.previewTitle}>Live Preview</h3>
          <p className={styles.previewSubtitle}>
            Updates as you edit settings
          </p>
        </div>

        <div className={styles.previewFrame}>
          <div className={styles.previewFrameBar}>
            <span className={styles.previewDot} />
            <span className={styles.previewDot} />
            <span className={styles.previewDot} />
            <span className={styles.previewUrl}>your-store.myshopify.com</span>
          </div>
          <div className={styles.previewStore}>
            <div className={styles.previewSkeleton}>
              <span />
              <span />
              <span />
            </div>
            {enabled && preview.label && (
              <div className={styles.previewTooltip}>{preview.label}</div>
            )}
            <div
              className={`${styles.previewButton} ${enabled ? styles.previewButtonActive : styles.previewButtonHidden}`}
              title={preview.label || "WhatsApp"}
              aria-hidden="true"
            >
              <WhatsAppIcon size={26} />
            </div>
          </div>
        </div>

        <div className={styles.previewMeta}>
          <div className={styles.previewMetaRow}>
            <span className={styles.previewMetaLabel}>Status</span>
            <span className={styles.previewMetaValue}>
              {enabled ? "Visible" : "Hidden"}
            </span>
          </div>
          <div className={styles.previewMetaRow}>
            <span className={styles.previewMetaLabel}>Number</span>
            <span className={styles.previewMetaValue}>{phone}</span>
          </div>
          <div className={styles.previewMetaRow}>
            <span className={styles.previewMetaLabel}>Message</span>
            <span className={styles.previewMetaValue}>
              {preview.message || "—"}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}

function normalizeDigits(value) {
  return String(value || "").replace(/\D/g, "");
}

function combinePhoneNumber(countryCode, localPhoneNumber) {
  const code = normalizeDigits(countryCode);
  const local = normalizeDigits(localPhoneNumber);
  if (!code || !local) return "";
  return `${code}${local}`;
}

export const loader = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);

  const response = await admin.graphql(
    `#graphql
      query whatsappSettings {
        currentAppInstallation {
          id
          metafield(namespace: "whatsapp", key: "settings") {
            value
          }
          enabled: metafield(namespace: "whatsapp", key: "enabled") {
            value
          }
          phone: metafield(namespace: "whatsapp", key: "phone_number") {
            value
          }
          defaultMessageField: metafield(namespace: "whatsapp", key: "default_message") {
            value
          }
          buttonLabelField: metafield(namespace: "whatsapp", key: "button_label") {
            value
          }
        }
      }`,
  );
  const responseJson = await response.json();
  const installation = responseJson.data?.currentAppInstallation || null;
  const rawSettings = installation?.metafield?.value;
  let parsedSettings = {
    countryCode: "91",
    localPhoneNumber: "",
    phoneNumber: "",
    defaultMessage: "Hi, I need help.",
    buttonLabel: "Chat on WhatsApp",
    isEnabled: true,
  };

  if (rawSettings) {
    try {
      const parsed = JSON.parse(rawSettings);
      parsedSettings = { ...parsedSettings, ...parsed };
      if (typeof parsed.isEnabled === "boolean") {
        parsedSettings.isEnabled = parsed.isEnabled;
      }
    } catch (_error) {
      // Fallback to defaults if malformed JSON exists.
    }
  }
  const enabledValue = installation?.enabled?.value;
  if (typeof enabledValue === "boolean") {
    parsedSettings.isEnabled = enabledValue;
  } else if (typeof enabledValue === "string") {
    parsedSettings.isEnabled = enabledValue !== "false";
  }
  const phoneField = installation?.phone?.value;
  const defaultMessageField = installation?.defaultMessageField?.value;
  const buttonLabelField = installation?.buttonLabelField?.value;
  const splitPhone = splitStoredPhoneNumber(
    phoneField || parsedSettings.phoneNumber,
    parsedSettings.countryCode,
    parsedSettings.localPhoneNumber,
  );
  parsedSettings.countryCode = splitPhone.countryCode;
  parsedSettings.localPhoneNumber = splitPhone.localPhoneNumber;
  parsedSettings.phoneNumber = combinePhoneNumber(
    splitPhone.countryCode,
    splitPhone.localPhoneNumber,
  );
  if (defaultMessageField) parsedSettings.defaultMessage = defaultMessageField;
  if (buttonLabelField) parsedSettings.buttonLabel = buttonLabelField;

  const apiKey = process.env.SHOPIFY_API_KEY || "";
  const themeEditorDeepLink =
    apiKey && session?.shop
      ? `https://${session.shop}/admin/themes/current/editor?context=apps&activateAppId=${apiKey}/${BRANDING.themeEmbedHandle}`
      : null;

  return {
    settings: parsedSettings,
    themeEditorDeepLink,
  };
};

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const formData = await request.formData();
  const countryCode = String(formData.get("countryCode") || "").trim();
  const localPhoneNumber = String(formData.get("localPhoneNumber") || "").trim();
  const defaultMessage = String(formData.get("defaultMessage") || "").trim();
  const buttonLabel = String(formData.get("buttonLabel") || "").trim();
  const isEnabled = formData.get("isEnabled") === "on";
  const phoneNumber = combinePhoneNumber(countryCode, localPhoneNumber);

  if (!phoneNumber) {
    return {
      ok: false,
      error: "Enter both country code and phone number.",
    };
  }

  const appInstallResponse = await admin.graphql(
    `#graphql
      query appInstallId {
        currentAppInstallation {
          id
        }
      }`,
  );
  const appInstallJson = await appInstallResponse.json();
  const ownerId = appInstallJson.data?.currentAppInstallation?.id;

  if (!ownerId) {
    return { ok: false, error: "App installation not found." };
  }

  const settingsPayload = JSON.stringify({
    countryCode: normalizeDigits(countryCode),
    localPhoneNumber: normalizeDigits(localPhoneNumber),
    phoneNumber,
    defaultMessage: defaultMessage || "Hi, I need help.",
    buttonLabel: buttonLabel || "Chat on WhatsApp",
    isEnabled,
  });

  const saveResponse = await admin.graphql(
    `#graphql
      mutation saveWhatsappSettings($metafields: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafields) {
          metafields {
            id
            key
            namespace
            value
          }
          userErrors {
            field
            message
          }
        }
      }`,
    {
      variables: {
        metafields: [
          {
            ownerId,
            namespace: "whatsapp",
            key: "settings",
            type: "json",
            value: settingsPayload,
          },
          {
            ownerId,
            namespace: "whatsapp",
            key: "enabled",
            type: "single_line_text_field",
            value: isEnabled ? "true" : "false",
          },
          {
            ownerId,
            namespace: "whatsapp",
            key: "phone_number",
            type: "single_line_text_field",
            value: phoneNumber,
          },
          {
            ownerId,
            namespace: "whatsapp",
            key: "default_message",
            type: "multi_line_text_field",
            value: defaultMessage || "Hi, I need help.",
          },
          {
            ownerId,
            namespace: "whatsapp",
            key: "button_label",
            type: "single_line_text_field",
            value: buttonLabel || "Chat on WhatsApp",
          },
        ],
      },
    },
  );
  const saveJson = await saveResponse.json();
  const userErrors = saveJson.data?.metafieldsSet?.userErrors || [];

  if (userErrors.length > 0) {
    return { ok: false, error: userErrors[0]?.message || "Save failed" };
  }

  return { ok: true };
};

export const meta = () => [{ title: BRANDING.pageTitle }];

export default function Index() {
  const { settings, themeEditorDeepLink } = useLoaderData();
  const fetcher = useFetcher();
  const shopify = useAppBridge();
  const [preview, setPreview] = useState({
    countryCode: settings.countryCode,
    localPhone: settings.localPhoneNumber,
    message: settings.defaultMessage,
    label: settings.buttonLabel,
    enabled: settings.isEnabled,
  });
  const countryOptions = getCountryOptions(preview.countryCode);
  const isSaving =
    ["loading", "submitting"].includes(fetcher.state) &&
    fetcher.formMethod === "POST";
  const displayPhone = formatPreviewPhone(
    settings.countryCode,
    settings.localPhoneNumber,
  );

  useEffect(() => {
    setPreview({
      countryCode: settings.countryCode,
      localPhone: settings.localPhoneNumber,
      message: settings.defaultMessage,
      label: settings.buttonLabel,
      enabled: settings.isEnabled,
    });
  }, [
    settings.countryCode,
    settings.localPhoneNumber,
    settings.defaultMessage,
    settings.buttonLabel,
    settings.isEnabled,
  ]);

  useEffect(() => {
    if (fetcher.data?.ok) {
      shopify.toast.show("WhatsApp settings saved");
    }
    if (fetcher.data?.error) {
      shopify.toast.show(fetcher.data.error, { isError: true });
    }
  }, [fetcher.data, shopify]);

  const updatePreview = (field, value) => {
    setPreview((current) => ({ ...current, [field]: value }));
  };

  return (
    <s-page heading={BRANDING.pageTitle}>
      <div className={styles.page}>
        <header className={styles.hero}>
          <div className={styles.heroOrbs} aria-hidden="true">
            <span />
            <span />
          </div>
          <div className={styles.heroInner}>
            <div className={styles.heroBrand}>
              <div className={styles.heroLogoWrap}>
                <img
                  src={APP_LOGO}
                  alt={`${BRANDING.company} — ${BRANDING.appName}`}
                  className={styles.heroLogo}
                />
              </div>
              <div className={styles.heroContent}>
                <span className={styles.heroEyebrow}>{BRANDING.company}</span>
                <h2 className={styles.heroTitle}>{BRANDING.appName}</h2>
                <p className={styles.heroText}>
                  Configure your floating WhatsApp chat button from this
                  dashboard. Settings apply store-wide when App embed is enabled.
                </p>
                {displayPhone !== "Not configured" && (
                  <span className={styles.heroPhoneChip}>
                    <WhatsAppIcon size={16} />
                    {displayPhone}
                  </span>
                )}
              </div>
            </div>
            <div className={styles.heroActions}>
              <span className={styles.statusPill}>
                <span
                  className={`${styles.statusDot} ${settings.isEnabled ? "" : styles.statusDotOff}`}
                  aria-hidden="true"
                />
                {settings.isEnabled ? "Button active" : "Button hidden"}
              </span>
            </div>
          </div>
          <div className={styles.statsRow}>
            <div className={styles.stat}>
              <span className={styles.statIcon} aria-hidden="true">
                🌐
              </span>
              <div>
                <span className={styles.statValue}>Global</span>
                <span className={styles.statLabel}>All pages</span>
              </div>
            </div>
            <div className={styles.stat}>
              <span className={styles.statIcon} aria-hidden="true">
                ⚡
              </span>
              <div>
                <span className={styles.statValue}>1-Click</span>
                <span className={styles.statLabel}>WhatsApp chat</span>
              </div>
            </div>
            <div className={styles.stat}>
              <span className={styles.statIcon} aria-hidden="true">
                ⚙️
              </span>
              <div>
                <span className={styles.statValue}>Dashboard</span>
                <span className={styles.statLabel}>Central control</span>
              </div>
            </div>
          </div>
        </header>

        <div className={styles.mainGrid}>
          <div className={styles.formColumn}>
            <div
              className={`${styles.card} ${styles.cardDelay1} ${styles.cardOverflowVisible}`}
            >
              <div className={styles.cardAccent} aria-hidden="true" />
              <div className={styles.cardBody}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardHeaderIcon} aria-hidden="true">
                    ⚙️
                  </span>
                  <div>
                    <h3 className={styles.cardTitle}>
                      Global WhatsApp Button Settings
                    </h3>
                    <p className={styles.cardSubtitle}>
                      Manage your number, message, and button visibility here.
                      You do not need to change these in the theme editor.
                    </p>
                  </div>
                </div>

                <fetcher.Form
                  method="POST"
                  key={`whatsapp-settings-${settings.isEnabled}-${settings.phoneNumber}`}
                  className={styles.formGrid}
                >
                  <div className={styles.fieldPanel}>
                    <span className={styles.fieldLabel}>
                      <span className={styles.fieldIcon} aria-hidden="true">
                        📱
                      </span>
                      WhatsApp Number
                    </span>
                    <div className={styles.phoneRow}>
                      <div className={styles.inputWrap}>
                        <CountryCodeSelect
                          id="countryCode"
                          name="countryCode"
                          value={preview.countryCode}
                          options={countryOptions}
                          required
                          onChange={(code) =>
                            updatePreview("countryCode", code)
                          }
                        />
                      </div>
                      <div className={styles.inputWrap}>
                        <label
                          className={styles.inputLabel}
                          htmlFor="localPhoneNumber"
                        >
                          Phone number
                        </label>
                        <input
                          id="localPhoneNumber"
                          name="localPhoneNumber"
                          type="text"
                          inputMode="numeric"
                          className={styles.input}
                          value={preview.localPhone}
                          placeholder="9876543210"
                          required
                          onChange={(event) =>
                            updatePreview(
                              "localPhone",
                              event.target.value.replace(/\D/g, ""),
                            )
                          }
                        />
                      </div>
                    </div>
                    <p className={styles.hint}>
                      Click the <strong>Country code</strong> box to pick your
                      country. Enter the phone number without the country code
                      on the right.
                    </p>
                  </div>

                  <div className={styles.fieldPanel}>
                    <label className={styles.fieldLabel} htmlFor="defaultMessage">
                      <span className={styles.fieldIcon} aria-hidden="true">
                        💬
                      </span>
                      Default Message
                    </label>
                    <textarea
                      id="defaultMessage"
                      name="defaultMessage"
                      rows={4}
                      className={styles.textarea}
                      defaultValue={settings.defaultMessage}
                      placeholder="Hi, I need help."
                      onChange={(event) =>
                        updatePreview("message", event.target.value)
                      }
                    />
                  </div>

                  <div className={styles.fieldPanel}>
                    <label className={styles.fieldLabel} htmlFor="buttonLabel">
                      <span className={styles.fieldIcon} aria-hidden="true">
                        🏷
                      </span>
                      Button Label
                    </label>
                    <input
                      id="buttonLabel"
                      name="buttonLabel"
                      type="text"
                      className={styles.input}
                      defaultValue={settings.buttonLabel}
                      placeholder="Chat on WhatsApp"
                      onChange={(event) =>
                        updatePreview("label", event.target.value)
                      }
                    />
                  </div>

                  <div className={styles.toggleBox}>
                    <div className={styles.toggleInfo}>
                      <label className={styles.toggleLabel} htmlFor="isEnabled">
                        Keep WhatsApp button enabled
                      </label>
                      <span className={styles.toggleHint}>
                        Turn off to hide the button on your storefront without
                        disabling the app embed.
                      </span>
                    </div>
                    <label className={styles.switch}>
                      <input
                        id="isEnabled"
                        name="isEnabled"
                        type="checkbox"
                        defaultChecked={settings.isEnabled}
                        key={`enabled-${settings.isEnabled}`}
                        onChange={(event) =>
                          updatePreview("enabled", event.target.checked)
                        }
                      />
                      <span className={styles.switchTrack} aria-hidden="true" />
                    </label>
                  </div>

                  <div className={styles.formActions}>
                    <s-button
                      type="submit"
                      {...(isSaving ? { loading: true } : {})}
                      variant="primary"
                    >
                      Save settings
                    </s-button>
                    <p className={styles.saveHint}>
                      Changes apply to your storefront after saving
                    </p>
                  </div>
                </fetcher.Form>
              </div>
            </div>
          </div>

          <StorePreview preview={preview} />
        </div>

        <div className={`${styles.card} ${styles.cardDelay2}`}>
          <div className={styles.cardAccent} aria-hidden="true" />
          <div className={styles.cardBody}>
            <div className={styles.guideHeader}>
              <div className={`${styles.cardHeader} ${styles.guideHeaderMain}`}>
                <span className={styles.cardHeaderIcon} aria-hidden="true">
                  📋
                </span>
                <div>
                  <h3 className={styles.cardTitle}>Setup Guide</h3>
                  <p className={styles.cardSubtitle}>
                    Follow these steps to show the button on every page.
                  </p>
                </div>
              </div>
              <span className={styles.guideBadge}>7 steps</span>
            </div>

            <div className={styles.callout}>
              <span className={styles.calloutIcon} aria-hidden="true">
                💡
              </span>
              <p className={styles.calloutText}>
                To show the button on <strong>all pages</strong>, use{" "}
                <strong>App embeds</strong>. Do not add the WhatsApp block inside
                a page section — that only works on that one page (for example,
                home page only).
              </p>
            </div>

            {themeEditorDeepLink && (
              <div className={styles.deepLinkRow}>
                <a
                  href={themeEditorDeepLink}
                  target="_top"
                  rel="noopener noreferrer"
                  className={styles.deepLinkButton}
                >
                  Open Theme Editor → Enable WhatsApp Floating Button
                </a>
              </div>
            )}

            <ol className={styles.steps}>
              {SETUP_STEPS.map((step, index) => (
                <li key={index} className={styles.step}>
                  <span className={styles.stepNum}>{index + 1}</span>
                  <div className={styles.stepContent}>{step}</div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <footer className={styles.brandFooter}>
          <img
            src={APP_LOGO}
            alt={BRANDING.company}
            className={styles.brandFooterLogo}
          />
          <p className={styles.brandFooterText}>
            © {new Date().getFullYear()} {BRANDING.company} · {BRANDING.appName}
          </p>
          <a className={styles.brandFooterLink} href={BRANDING.privacyPath}>
            Privacy Policy
          </a>
        </footer>
      </div>
    </s-page>
  );
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
