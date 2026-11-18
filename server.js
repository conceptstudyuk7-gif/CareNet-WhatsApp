import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { createRequestHandler } from "@react-router/express";
import express from "express";

// Local runs can use a .env file. Hostinger injects variables and has no file.
if (existsSync(".env")) {
  for (const line of readFileSync(".env", "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const eq = trimmed.indexOf("=");
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

process.env.NODE_ENV = process.env.NODE_ENV ?? "production";

// Hostinger starts this file directly, so apply DB migrations here.
execSync("npx prisma migrate deploy", { stdio: "inherit" });

const app = express();
app.disable("x-powered-by");
app.set("trust proxy", true);

// Hashed assets can be cached. Do not let a static index replace app routes.
app.use(
  "/assets",
  express.static("dist/assets", { immutable: true, maxAge: "1y" }),
);
app.use(express.static("dist", { index: false, maxAge: "1h" }));

app.all(
  "*",
  createRequestHandler({
    build: await import("./build/server/index.js"),
    mode: process.env.NODE_ENV,
  }),
);

const port = Number(process.env.PORT) || 3000;
app.listen(port, "0.0.0.0", () => {
  console.log(`CareNet WhatsApp listening on port ${port}`);
});
