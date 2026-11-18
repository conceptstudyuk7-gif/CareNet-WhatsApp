import { copyFileSync } from "node:fs";
import path from "node:path";
import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { getViteBase } from "./app-path.config.js";

/**
 * Client-only production names. React Router still owns the server bundle
 * (`build/server/index.js`). This plugin runs first so the client build emits
 * hashed `assets/index-[hash].js` and `assets/index-[hash].css` files, while
 * the SSR build keeps its own entry filename.
 */
function clientProductionBuild() {
  return {
    name: "client-production-build",
    apply: "build",
    config(_config, { isSsrBuild }) {
      if (isSsrBuild) return null;

      return {
        build: {
          assetsDir: "assets",
          assetsInlineLimit: 0,
          cssCodeSplit: true,
          cssMinify: true,
          emptyOutDir: true,
          minify: "esbuild",
          sourcemap: false,
          rollupOptions: {
            output: {
              entryFileNames: "assets/index-[hash].js",
              chunkFileNames: "assets/[name]-[hash].js",
              assetFileNames(assetInfo) {
                const sourceName =
                  assetInfo.names?.[0] || assetInfo.name || "";

                if (sourceName.endsWith(".css")) {
                  return "assets/index-[hash][extname]";
                }

                return "assets/[name]-[hash][extname]";
              },
            },
          },
        },
      };
    },
    closeBundle() {
      const manifestPath = path.resolve("build/client/.vite/manifest.json");
      const savedManifestPath = path.resolve("build/client-manifest.json");

      try {
        copyFileSync(manifestPath, savedManifestPath);
      } catch {
        // The manifest exists only after the client build. React Router
        // removes build/client/.vite once the server build finishes.
      }
    },
  };
}

// Related: https://github.com/remix-run/remix/issues/2835#issuecomment-1144102176
// Replace the HOST env var with SHOPIFY_APP_URL so that it doesn't break the Vite server.
// The CLI will eventually stop passing in HOST,
// so we can remove this workaround after the next major release.
if (
  process.env.HOST &&
  (!process.env.SHOPIFY_APP_URL ||
    process.env.SHOPIFY_APP_URL === process.env.HOST)
) {
  process.env.SHOPIFY_APP_URL = process.env.HOST;
  delete process.env.HOST;
}

const host = new URL(process.env.SHOPIFY_APP_URL || "http://localhost")
  .hostname;
let hmrConfig;

if (host === "localhost") {
  hmrConfig = {
    protocol: "ws",
    host: "localhost",
    port: 64999,
    clientPort: 64999,
  };
} else {
  hmrConfig = {
    protocol: "wss",
    host: host,
    port: parseInt(process.env.FRONTEND_PORT) || 8002,
    clientPort: 443,
  };
}

export default defineConfig({
  base: getViteBase(),
  server: {
    allowedHosts: [host],
    cors: {
      preflightContinue: true,
    },
    port: Number(process.env.PORT || 3000),
    hmr: hmrConfig,
    fs: {
      // See https://vitejs.dev/config/server-options.html#server-fs-allow for more information
      allow: ["app", "node_modules"],
    },
  },
  plugins: [clientProductionBuild(), reactRouter(), tsconfigPaths()],
  build: {
    assetsDir: "assets",
    // Keep SVG, WebP, and other images as files so they get hashed names.
    assetsInlineLimit: 0,
    cssMinify: true,
    sourcemap: false,
    // Drop debugger statements. Leave console.error in place for production logs.
    esbuild: {
      drop: ["debugger"],
      legalComments: "none",
    },
  },
  optimizeDeps: {
    include: ["@shopify/app-bridge-react"],
  },
});
