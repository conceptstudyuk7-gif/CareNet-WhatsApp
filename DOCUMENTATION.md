# WhatsApp Integration — App Documentation

This document covers **merchant setup**, **troubleshooting**, and **Shopify App Store publish** steps for the WhatsApp Integration app.

---

## 1. App Overview

**App name:** WhatsApp Integration (whatsapp int)  
**Type:** Embedded Shopify app + Theme app extension  
**Purpose:** Add a floating WhatsApp chat button to the storefront so customers can start a conversation with one click.

### What merchants get

- A floating WhatsApp button on all store pages
- Central control from the app dashboard (number, message, label, on/off)
- Country code picker with country name (e.g. `+91 India`)
- Custom default message pre-filled when WhatsApp opens
- Button color customization in the theme editor

### What the app does not do

- Does not send automated WhatsApp messages
- Does not read customer WhatsApp chats
- Does not replace WhatsApp Business API / official WhatsApp marketing tools

---

## 2. Features

| Feature | Description |
|--------|-------------|
| Global floating button | Shows on all pages when App embed is enabled |
| Country + phone fields | Separate country code and local phone number |
| Default message | Pre-filled text when customer opens WhatsApp |
| Button label | Accessibility label for the floating button |
| Enable / disable toggle | Show or hide button without uninstalling the app |
| Theme colors | Button and icon colors from Theme → App embeds |
| Dashboard-only settings | Phone, message, and visibility managed in the app |

---

## 3. Merchant Setup Guide

### Step 1 — Install the app

1. Open the Shopify App Store or install link from the developer.
2. Click **Install app** and approve permissions.
3. Open the app from **Apps** in Shopify Admin.

### Step 2 — Configure WhatsApp settings

In the app dashboard:

1. **Country** — Select your country (e.g. `+91 India`).
2. **Phone number** — Enter the number **without** country code (e.g. `7741092638`).
3. **Default message** — Message that opens in WhatsApp (e.g. `Hi, I need help.`).
4. **Button label** — Label for accessibility (e.g. `Chat on WhatsApp`).
5. **Keep WhatsApp button enabled** — Check to show the button on the store.
6. Click **Save settings**.

**Example:** Country `+91 India` + phone `7741092638` → WhatsApp link uses `+91 7741092638`.

### Step 3 — Enable on the storefront (required, one time)

> **Important:** Use **App embeds**, not an app block inside a page section. A page block only shows on that one page (e.g. home page only).

1. Go to **Online Store** → **Themes** → **Customize**.
2. If a **WhatsApp Button** block was added inside a home page section, **remove it**.
3. In the left sidebar, open **App embeds** (puzzle icon).
4. Turn **WhatsApp Floating Button** **ON**.
5. Optional: change **Button color** and **Text color**.
6. Click **Save**.

### Step 4 — Verify

1. Open your live storefront (home, product, collection, contact pages).
2. Confirm the green WhatsApp button appears bottom-right on **all pages**.
3. Click the button and confirm WhatsApp opens with the correct number and message.

---

## 4. Troubleshooting

### Button only shows on home page

**Cause:** A WhatsApp block was added to a single page section instead of using App embeds.

**Fix:**

1. Theme → Customize → remove any WhatsApp block from page sections.
2. Enable **WhatsApp Floating Button** under **App embeds**.
3. Save the theme.

### Button does not show anywhere

Check:

1. **Keep WhatsApp button enabled** is checked in the app dashboard.
2. Country and phone number are saved.
3. **WhatsApp Floating Button** is ON under App embeds.
4. Theme is saved after enabling the embed.
5. Hard-refresh the storefront (Ctrl+F5 / Cmd+Shift+R).

### Wrong phone number on WhatsApp

1. Open the app dashboard.
2. Update **Country** and **Phone number**.
3. Click **Save settings**.
4. Do **not** change the number in Theme Customize (only colors are used there).

### Enable / disable toggle not working

1. Uncheck or check **Keep WhatsApp button enabled**.
2. Click **Save settings**.
3. Refresh the storefront.
4. Ensure the latest app version is deployed (`npm run deploy` for developers).

### Button shows but wrong message

Update **Default message** in the app dashboard and click **Save settings**.

---

## 5. Data & Privacy (for App Store listing)

Use this as a basis for your privacy policy and App Store data disclosure.

### Data collected

- **Shop session data** — Required for app authentication (stored in app database).
- **App settings** — WhatsApp number, default message, button label, enabled state (stored as app installation metafields).

### Data not collected

- Customer personal data from the storefront
- WhatsApp chat content
- Order or payment data (unless added in future versions)

### Third-party services

- **WhatsApp (Meta)** — When a customer clicks the button, they are redirected to WhatsApp. Meta’s terms and privacy policy apply.

### Merchant responsibility

- Merchants must use a WhatsApp number they own or are authorized to use.
- Merchants are responsible for compliance with local laws and WhatsApp/Meta policies.

---

## 6. Developer — Pre-publish Checklist

Complete these before submitting to the Shopify App Store.

### App configuration

- [ ] Update app name in Partner Dashboard (avoid placeholder names like `whatsapp int` if publishing publicly).
- [ ] Set production **Application URL** in `shopify.app.toml` and Partner Dashboard — **must NOT be `https://example.com`** (Shopify webhook HMAC checks hit this URL; `example.com` returns 405 and fails distribution)
- [ ] Set production **Redirect URLs** for OAuth.
- [ ] Mandatory compliance webhooks configured in `shopify.app.toml` (`customers/data_request`, `customers/redact`, `shop/redact`)
- [ ] Remove or replace demo template metafields/metaobjects in `shopify.app.toml` if not used.

### Hosting & database

- [ ] Deploy app to production hosting (Fly.io, Render, Google Cloud Run, etc.).
- [ ] Replace SQLite with **PostgreSQL** (or another production database) for session storage.
- [ ] Set environment variables on host:
  - `SHOPIFY_API_KEY`
  - `SHOPIFY_API_SECRET`
  - `SCOPES`
  - `SHOPIFY_APP_URL`
  - `DATABASE_URL`
  - `NODE_ENV=production`
- [ ] Run database migrations: `npm run setup`

### Extension

- [ ] Deploy extension: `npm run deploy`
- [ ] Test App embed on a development store with Online Store 2.0 theme.
- [ ] Test on mobile and desktop.

### App Store listing assets

Prepare in [Shopify Partner Dashboard](https://partners.shopify.com/):

- [ ] App icon (1200×1200 px)
- [ ] Feature media / screenshots (desktop + mobile)
- [ ] Short description (max ~100 characters)
- [ ] Long description (features + setup summary)
- [ ] Privacy policy URL (required)
- [ ] Support email or support URL
- [ ] Pricing plan (free or paid)
- [ ] App review instructions for Shopify reviewers

### Suggested app review instructions (for Shopify)

Copy into the **Testing instructions** field in the submission:

```
1. Install the app on the review development store.
2. Open the app and set:
   - Country: +91 India (or any valid country)
   - Phone number: a valid WhatsApp number without country code
   - Default message: Hi, I need help.
   - Keep WhatsApp button enabled: ON
3. Click Save settings.
4. Go to Online Store → Themes → Customize.
5. Open App embeds (puzzle icon) and enable "WhatsApp Floating Button".
6. Save the theme.
7. View the storefront — the WhatsApp button should appear on all pages.
8. Click the button to verify WhatsApp opens with the saved number and message.
9. In the app, uncheck "Keep WhatsApp button enabled", save, and confirm the button disappears on the storefront.
```

---

## 7. Deployment Commands

### Local development

```bash
npm install
npm run dev
```

### Production build

```bash
npm run build
```

### Deploy app + extension to Shopify

```bash
npm run deploy
```

### Start production server (after build)

```bash
npm run setup
npm run start
```

---

## 8. App Store Listing Copy (draft)

Use and edit for Partner Dashboard → App listing.

### App name (suggestion)

**WhatsApp Chat Button**

### Tagline (short description)

Add a floating WhatsApp button to your store. Manage number, message, and visibility from one dashboard.

### Long description (draft)

**WhatsApp Chat Button** helps Shopify merchants connect with customers instantly through WhatsApp.

**Features:**

- Floating WhatsApp button on all store pages
- Easy setup from the app dashboard
- Country code picker with country names
- Custom default message when customers open WhatsApp
- Show or hide the button anytime
- Customize button colors in the theme editor

**Setup in minutes:**

1. Install the app and enter your WhatsApp number.
2. Enable the WhatsApp Floating Button in Theme → App embeds.
3. Save and start receiving customer messages on WhatsApp.

Perfect for small businesses, D2C brands, and stores that want a simple way to offer WhatsApp support without complex integrations.

### Key benefits (bullet points for listing)

- One-click WhatsApp chat from any page
- No coding required
- Central dashboard for all settings
- Works with Online Store 2.0 themes
- Mobile-friendly floating button

### Search keywords (suggestions)

WhatsApp, chat button, customer support, floating button, WhatsApp widget, contact button, live chat alternative

---

## 9. Technical Architecture (reference)

| Component | Path / technology |
|-----------|-------------------|
| App backend | React Router + `@shopify/shopify-app-react-router` |
| Admin UI | `app/routes/app._index.jsx` |
| Session storage | Prisma + SQLite (dev) — use PostgreSQL in production |
| Theme extension | `extensions/whatsapp-button/blocks/whatsapp-floating-embed.liquid` |
| Settings storage | App installation metafields (`whatsapp` namespace) |
| Webhooks | `app/uninstalled`, `app/scopes_update` |

### Metafields used

| Key | Purpose |
|-----|---------|
| `settings` (JSON) | Full settings including `isEnabled`, country, phone |
| `phone_number` | Combined WhatsApp number for storefront |
| `default_message` | Pre-filled WhatsApp message |
| `button_label` | Accessibility label |
| `enabled` | Legacy enabled flag (string) |

---

## 10. Support Template

Use for merchant support replies.

**Installation help:**

> After installing, open the app, save your WhatsApp number and message, then go to Online Store → Themes → Customize → App embeds → enable "WhatsApp Floating Button" → Save.

**Button not on all pages:**

> Please use App embeds, not a block inside a page section. Remove any WhatsApp block from the home page section and enable the App embed instead.

**Disable button temporarily:**

> Uncheck "Keep WhatsApp button enabled" in the app dashboard and click Save settings.

---

## 11. Version & Contact

| Item | Value |
|------|--------|
| App version | 1.0.0 (update before publish) |
| Shopify API version | 2026-07 (webhooks) / October25 (app package) |
| Support email | support@carenetsolutions.com |
| Privacy policy URL | [privacy-policy.html](./privacy-policy.html) (standalone) or `/privacy` (app route) |
| Developer / company | CareNetSolutions |

---

## 12. Publish Flow Summary

1. **Build & host** the app in production with a real database.
2. **Configure** Partner Dashboard app URLs and OAuth redirects.
3. **Deploy** with `npm run deploy`.
4. **Test** full merchant flow on a development store.
5. **Create** privacy policy and support page.
6. **Prepare** listing assets (icon, screenshots, descriptions).
7. **Submit** for App Store review in Partner Dashboard.
8. **Respond** to reviewer feedback if any.

**Official Shopify resources:**

- [Launch your app](https://shopify.dev/docs/apps/launch)
- [App Store requirements](https://shopify.dev/docs/apps/launch/app-requirements-checklist)
- [Deployment guide](https://shopify.dev/docs/apps/launch/deployment)

---

*Last updated: May 2026*
