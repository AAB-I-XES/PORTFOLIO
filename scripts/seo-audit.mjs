import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const distPath = join(root, "dist");
const indexFile = join(distPath, "index.html");

if (!existsSync(indexFile)) {
  console.error("Build output not found. Run the production build before running the audit.");
  process.exit(1);
}

const html = readFileSync(indexFile, "utf8");
const visibleHtml = html.replace(/<noscript[\s\S]*?<\/noscript>/gi, "");
const issues = [];

const addIssue = (message) => issues.push(message);

const hasTag = (pattern) => new RegExp(pattern, "i").test(visibleHtml);
const tagCount = (pattern) => [...html.matchAll(new RegExp(pattern, "gi"))].length;

if (!hasTag("<title>.*Dibyajyoti Rabha.*</title>")) {
  addIssue("Missing or generic page title.");
}

if (!hasTag('<meta[^>]+name="description"')) {
  addIssue("Missing meta description.");
}

if (!hasTag('<link[^>]+rel="canonical"')) {
  addIssue("Missing canonical URL.");
}

if (!hasTag('<meta[^>]+property="og:title"')) {
  addIssue("Missing Open Graph title.");
}

if (!hasTag('<meta[^>]+property="og:description"')) {
  addIssue("Missing Open Graph description.");
}

if (!hasTag('<meta[^>]+property="og:image"')) {
  addIssue("Missing Open Graph image.");
}

if (!hasTag('<meta[^>]+name="twitter:card"')) {
  addIssue("Missing Twitter card metadata.");
}

if (!html.includes('application/ld+json')) {
  addIssue("Missing structured data JSON-LD.");
}

if (!hasTag('<h1')) {
  addIssue("Missing H1 heading on homepage.");
}

if (!existsSync(join(distPath, "robots.txt"))) {
  addIssue("Missing dist/robots.txt.");
}

if (!existsSync(join(distPath, "sitemap.xml"))) {
  addIssue("Missing dist/sitemap.xml.");
}

if (!existsSync(join(distPath, "manifest.webmanifest"))) {
  addIssue("Missing dist/manifest.webmanifest.");
}

const imgMissingAlt = [...html.matchAll(/<img\s+[^>]*>/gi)].filter((imgTag) => {
  const src = imgTag[0];
  return !/alt\s*=\s*(?:"[^"]*"|'[^']*'|\S+)/i.test(src);
});
if (imgMissingAlt.length > 0) {
  addIssue(`Images missing alt text: ${imgMissingAlt.length}.`);
}

if (tagCount("<title>") > 1) {
  addIssue("Multiple title tags detected.");
}

if (tagCount('<meta[^>]+name="description"') > 1) {
  addIssue("Multiple meta description tags detected.");
}

if (issues.length === 0) {
  console.log("SEO audit passed: no critical structure issues found in the build output.");
  process.exit(0);
}

console.log("SEO audit found the following issues:");
for (const issue of issues) {
  console.log(`- ${issue}`);
}
process.exit(1);
