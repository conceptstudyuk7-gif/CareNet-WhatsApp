import { cp, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const clientDir = path.join(root, "build", "client");
const distDir = path.join(root, "dist");
const manifestPath = path.join(root, "build", "client-manifest.json");

async function copyProductionClient(src, dest) {
  await mkdir(dest, { recursive: true });
  const entries = await readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name === ".vite") continue;

    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyProductionClient(from, to);
    } else if (entry.isFile()) {
      await cp(from, to);
    }
  }
}

const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const entry = Object.entries(manifest).find(
  ([key, value]) => value?.isEntry && key.includes("entry.client"),
)?.[1];

if (!entry?.file) {
  throw new Error(
    "Could not find the client entry in build/client/.vite/manifest.json",
  );
}

await rm(distDir, { recursive: true, force: true });
await copyProductionClient(clientDir, distDir);

const assetFiles = await readdir(path.join(distDir, "assets"));
const jsFiles = assetFiles.filter((file) => /^index-.+\.js$/.test(file));
const cssFiles = assetFiles.filter((file) => /^index-.+\.css$/.test(file));
const logo = assetFiles.find((file) => /^logo-.+\.svg$/.test(file));
const banner = assetFiles.find((file) => /^banner-.+\.webp$/.test(file));

if (!jsFiles.length || !cssFiles.length || !logo || !banner) {
  throw new Error(
    `Production dist is missing required files.\n` +
      `js: ${jsFiles.join(", ") || "(none)"}\n` +
      `css: ${cssFiles.join(", ") || "(none)"}\n` +
      `logo: ${logo || "(none)"}\n` +
      `banner: ${banner || "(none)"}`,
  );
}

const entryJs = path.basename(entry.file);
const entryCss = (entry.css ?? [])
  .map((file) => path.basename(file))
  .filter((file) => cssFiles.includes(file));
const stylesheets = entryCss.length ? entryCss : [cssFiles[0]];

const cssLinks = stylesheets
  .map((file) => `    <link rel="stylesheet" href="./assets/${file}" />`)
  .join("\n");

const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CareNet WhatsApp</title>
    <link rel="icon" href="./assets/${logo}" type="image/svg+xml" />
${cssLinks}
  </head>
  <body>
    <div id="root"></div>
    <img src="./assets/${logo}" alt="CareNetSolutions logo" />
    <img src="./assets/${banner}" alt="CareNet WhatsApp banner" />
    <script type="module" src="./assets/${entryJs}"></script>
  </body>
</html>
`;

await writeFile(path.join(distDir, "index.html"), html, "utf8");

console.log("Production client published to dist/");
console.log(`  index.html`);
console.log(`  assets/${entryJs}`);
for (const file of stylesheets) console.log(`  assets/${file}`);
console.log(`  assets/${logo}`);
console.log(`  assets/${banner}`);
