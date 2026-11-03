import { AppProvider } from "@shopify/shopify-app-react-router/react";
import { useState } from "react";
import { Form, useActionData, useLoaderData } from "react-router";
import { login } from "../../shopify.server";
import { BRANDING } from "../../branding.js";
import { loginErrorMessage } from "./error.server";
import styles from "./styles.module.css";

export const meta = () => [
  { title: `Log in — ${BRANDING.appName}` },
];

export const loader = async ({ request }) => {
  const errors = loginErrorMessage(await login(request));
  const allowManualShopLogin = process.env.NODE_ENV !== "production";

  return { errors, allowManualShopLogin };
};

export const action = async ({ request }) => {
  if (process.env.NODE_ENV === "production") {
    return { errors: {}, allowManualShopLogin: false };
  }

  const errors = loginErrorMessage(await login(request));

  return {
    errors,
    allowManualShopLogin: true,
  };
};

export default function Auth() {
  const loaderData = useLoaderData();
  const actionData = useActionData();
  const [shop, setShop] = useState("");
  const data = actionData || loaderData;
  const { errors, allowManualShopLogin } = data;

  if (!allowManualShopLogin) {
    return (
      <AppProvider embedded={false}>
        <div className={styles.page}>
          <div className={styles.wrap}>
            <h1 className={styles.title}>{BRANDING.appName}</h1>
            <p className={styles.text}>
              Install or open this app from Shopify Admin under{" "}
              <strong>Apps</strong>. Manual shop login is not available on this
              page.
            </p>
            <a className={styles.link} href={BRANDING.homePath}>
              Go to app home
            </a>
          </div>
        </div>
      </AppProvider>
    );
  }

  return (
    <AppProvider embedded={false}>
      <s-page>
        <Form method="post">
          <s-section heading="Log in">
            <s-text-field
              name="shop"
              label="Shop domain"
              details="example.myshopify.com"
              value={shop}
              onChange={(e) => setShop(e.currentTarget.value)}
              autocomplete="on"
              error={errors.shop}
            ></s-text-field>
            <s-button type="submit">Log in</s-button>
          </s-section>
        </Form>
      </s-page>
    </AppProvider>
  );
}
