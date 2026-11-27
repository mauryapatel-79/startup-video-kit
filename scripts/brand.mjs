#!/usr/bin/env node
// Brand memory: capture a brand's facts and assets once, reuse them in every video.
//
//   node scripts/brand.mjs init <url> [--slug name] [--force]   capture the site into brands/<slug>/ (draft)
//   node scripts/brand.mjs check [slug]                          validate one brand, or all
//   node scripts/brand.mjs list                                  list brands and their status
//   node scripts/brand.mjs use <slug> <video-dir>                copy logos + fonts, write assets/brand/brand.css
//   node scripts/brand.mjs log <slug> <video-dir> [--recipe r]   record a delivered video in the brand's history
//
// No dependencies (Node 22+). `init` needs the HyperFrames CLI (npx hyperframes) and Chrome.

import { cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { basename, dirname, join, relative, resolve } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { parseArgs } from "node:util";
import { fileURLToPath, pathToFileURL } from "node:url";

const KIT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const BRANDS = join(KIT, "brands");
const STALE_DAYS = 180;
const HEX = /^#[0-9a-f]{3,8}$/i;

export const today = () => new Date().toISOString().slice(0, 10);

export function slugify(input) {
  let s = String(input).trim().toLowerCase();
  try { s = new URL(s.includes("://") ? s : `https://${s}`).hostname; } catch { /* plain name */ }
  return s.replace(/^www\./, "").replace(/\.[a-z]{2,}$/, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// Best guess at the brand's primary colour: the most-used vivid colour on the page (`colors` is in
// usage order), snapped to the CSS variable it renders from; else a vivid variable named
// primary/brand/accent. The person confirms it in brand.json.
export function guessPrimary(cssVariables = {}, colors = []) {
  const vars = Object.values(cssVariables).filter(isVivid);
  const page = colors.find(isVivid);
  if (page) {
    const near = vars.map((v) => [v, distance(v, page)]).sort((a, b) => a[1] - b[1])[0];
    return (near && near[1] < 24 ? near[0] : page).toUpperCase();
  }
  const named = Object.entries(cssVariables).find(([k, v]) => /primary|brand|accent/i.test(k) && isVivid(v));
  return (named?.[1] || colors[0] || "#111827").toUpperCase();
}

const rgb = (hex) => {
  let h = hex.slice(1, 7);
  if (h.length === 3) h = [...h].map((c) => c + c).join("");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
};
const distance = (a, b) => Math.hypot(...rgb(a).map((v, i) => v - rgb(b)[i]));

// Saturated and not dark: dark navy text colours are saturated but are not brand colours.
export function isVivid(hex) {
  if (!HEX.test(hex || "")) return false;
  const [r, g, b] = rgb(hex).map((v) => v / 255);
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  return max > 0.35 && (max - min) / max > 0.5;
}

// Wordmark = wide logo, mark = squarish logo, judged from the SVG viewBox.
export function classifyLogo(svgText) {
  const m = /viewBox="\s*[-\d.]+[\s,]+[-\d.]+[\s,]+([\d.]+)[\s,]+([\d.]+)/.exec(svgText || "");
  if (!m) return null;
  const ratio = Number(m[1]) / Number(m[2]);
  return ratio >= 3 ? "wordmark" : ratio <= 1.8 ? "mark" : null;
}

export function validateBrand(brand, { dir = ".", exists = existsSync, now = today() } = {}) {
  const errors = [], warnings = [];
  const req = (cond, msg) => { if (!cond) errors.push(msg); };
  req(brand.name, "name is missing");
  req(/^https?:\/\//.test(brand.website || ""), "website must be a full URL");
  req(brand.identity?.oneLiner, "identity.oneLiner is missing");
  req(brand.cta?.primary && brand.cta?.url, "cta.primary and cta.url are required");
  req(Array.isArray(brand.features) && brand.features.length > 0, "add at least one feature");
  req(HEX.test(brand.visual?.colors?.primary || ""), "visual.colors.primary must be a hex colour");
  for (const [k, v] of Object.entries(brand.visual?.colors || {})) if (!HEX.test(v)) errors.push(`visual.colors.${k} is not a hex colour: ${v}`);
  for (const f of brand.visual?.fonts || []) if (!exists(join(dir, f.file))) errors.push(`font file missing: ${f.file}`);
  for (const [k, f] of Object.entries(brand.visual?.logos || {})) if (f && !exists(join(dir, f))) errors.push(`logo ${k} missing: ${f}`);
  if (!brand.visual?.logos?.wordmark && !brand.visual?.logos?.mark) warnings.push("no logo picked: set visual.logos.wordmark or .mark");
  (brand.facts || []).forEach((f, i) => {
    const at = `facts[${i}] (${f.id || f.claim || "?"})`;
    if (!f.claim || !f.source || !f.captured) errors.push(`${at} needs claim, source and captured`);
    if (f.verified !== true) warnings.push(`${at} is not verified: confirm it with the brand before using it in ads`);
    if (f.captured && daysBetween(f.captured, now) > STALE_DAYS) warnings.push(`${at} is ${daysBetween(f.captured, now)} days old: re-check the source`);
  });
  if (brand.status !== "ready") warnings.push(`status is "${brand.status || "unset"}": review the draft, then set status to "ready"`);
  return { errors, warnings };
}

const daysBetween = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / 86400000);

export function brandCss(brand, prefix = "assets/brand/") {
  const faces = (brand.visual?.fonts || []).map((f) =>
    `@font-face { font-family: "${f.family}"; src: url("${prefix}${f.file.replace(/^assets\//, "")}") format("woff2"); font-weight: 100 900; }`);
  const vars = Object.entries(brand.visual?.colors || {}).map(([k, v]) => `  --brand-${k}: ${v};`);
  const fonts = brand.visual?.fonts || [];
  const display = (fonts.find((f) => !/mono|sign|icon|symbol/i.test(f.family)) || fonts[0])?.family;
  if (display) vars.push(`  --brand-font: "${display}", sans-serif;`);
  return `/* ${brand.name}: generated by scripts/brand.mjs use. Paste the @font-face lines into each scene's <style>. */\n${faces.join("\n")}\n:root {\n${vars.join("\n")}\n}\n`;
}

// ---------------------------------------------------------------- commands

// Run npx without a shell so a URL can never be read as shell syntax. On Windows npx is a .cmd file,
// which Node will not spawn without a shell, so call npm's own npx-cli.js with this Node instead.
function npx(args, opts) {
  const cli = join(dirname(process.execPath), "node_modules", "npm", "bin", "npx-cli.js");
  if (process.platform === "win32" && existsSync(cli)) return spawnSync(process.execPath, [cli, ...args], opts);
  if (process.platform === "win32") fail(`cannot find ${cli}; run: npx hyperframes capture <url> yourself`);
  return spawnSync("npx", args, opts);
}

export function normalizeUrl(input) {
  const hasScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(input);
  const u = new URL(hasScheme ? input : `https://${input}`);
  if (!/^https?:$/.test(u.protocol) || /["'`\s<>^|&;%$]/.test(decodeURI(u.href))) throw new Error(`not a plain web address: ${input}`);
  return u.href;
}

function init(input, { slug, force }) {
  let url;
  try { url = normalizeUrl(input); } catch (e) { fail(e.message); }
  slug ||= slugify(url);
  const dir = join(BRANDS, slug);
  if (existsSync(join(dir, "brand.json")) && !force) fail(`brands/${slug} already exists. Use --force to re-capture (your brand.json edits are kept).`);

  const tmp = mkdtempSync(join(tmpdir(), "brand-")); // short path: Chrome and Kokoro fail past 260 chars on Windows
  const cap = join(tmp, "capture");
  console.log(`Capturing ${url} (1-3 minutes)...`);
  const r = npx(["-y", "hyperframes", "capture", url, "-o", cap, "--skip-vision", "--json"], { cwd: tmp, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  if (r.status !== 0 || !existsSync(join(cap, "extracted", "tokens.json"))) fail(`capture failed:\n${(r.stderr || r.stdout || "").slice(-1500)}`);

  const tokens = JSON.parse(readFileSync(join(cap, "extracted", "tokens.json"), "utf8"));
  const date = today();
  for (const d of ["assets/logos", "assets/fonts", "screens", "sources"]) mkdirSync(join(dir, d), { recursive: true });

  // logos
  const logoFiles = [];
  for (const sub of ["assets", "assets/svgs"]) {
    const p = join(cap, sub);
    if (!existsSync(p)) continue;
    for (const f of readdirSync(p).filter((f) => /^logo-.*\.svg$/.test(f))) {
      cpSync(join(p, f), join(dir, "assets/logos", f));
      logoFiles.push(f);
    }
  }
  if (existsSync(join(cap, "assets/favicon.png"))) cpSync(join(cap, "assets/favicon.png"), join(dir, "assets/logos/favicon.png"));
  const logos = { wordmark: null, mark: null };
  for (const f of logoFiles) {
    const kind = classifyLogo(readFileSync(join(dir, "assets/logos", f), "utf8"));
    if (kind && !logos[kind]) logos[kind] = `assets/logos/${f}`;
  }

  // fonts: the largest file per family is the fullest (Latin) subset
  const fonts = [];
  const manifest = join(cap, "extracted", "fonts-manifest.json");
  if (existsSync(manifest)) {
    const best = {};
    for (const f of JSON.parse(readFileSync(manifest, "utf8")).files || []) {
      if (f.isIcon || !f.family) continue;
      const src = join(cap, "assets", "fonts", f.file);
      if (!existsSync(src)) continue;
      const size = statSync(src).size;
      if (!best[f.family] || size > best[f.family].size) best[f.family] = { src, size };
    }
    for (const [family, { src }] of Object.entries(best)) {
      const file = `assets/fonts/${slugify(family)}.woff2`;
      cpSync(src, join(dir, file));
      fonts.push({ family, file });
    }
  }

  // screens and sources
  const shots = existsSync(join(cap, "screenshots")) ? readdirSync(join(cap, "screenshots")).filter((f) => /^scroll-\d+\.png$/.test(f)) : [];
  shots.forEach((f) => cpSync(join(cap, "screenshots", f), join(dir, "screens", f)));
  for (const f of ["contact-sheet-1.jpg", "contact-sheet-2.jpg"]) if (existsSync(join(cap, "screenshots", f))) cpSync(join(cap, "screenshots", f), join(dir, "screens", f));
  const host = new URL(url).hostname.replace(/^www\./, "");
  const textFile = `sources/${date}-${host}.txt`;
  cpSync(join(cap, "extracted", "visible-text.txt"), join(dir, textFile));
  cpSync(join(cap, "extracted", "tokens.json"), join(dir, `sources/${date}-${host}-tokens.json`));

  const css = tokens.cssVariables || {};
  const prev = existsSync(join(dir, "brand.json")) ? JSON.parse(readFileSync(join(dir, "brand.json"), "utf8")) : null;
  const captured = {
    visual: {
      colors: {
        primary: guessPrimary(css, tokens.colors),
        ...(HEX.test(css["--background"] || "") && { background: css["--background"].toUpperCase() }),
        ...(HEX.test(css["--foreground"] || "") && { text: css["--foreground"].toUpperCase() }),
      },
      palette: (tokens.colors || []).filter((c) => HEX.test(c)).slice(0, 10),
      fonts,
      logos,
      style: "",
    },
    sources: [...(prev?.sources || []), { url, captured: date, text: textFile }],
  };
  const brand = prev
    ? { ...prev, visual: { ...captured.visual, ...prev.visual, palette: captured.visual.palette }, sources: captured.sources }
    : {
        slug,
        name: (tokens.title || slug).split(/\s+[-|–—:]\s+/)[0].trim(),
        website: url,
        status: "draft",
        updated: date,
        identity: { tagline: "", oneLiner: tokens.description || "", category: "", audience: "" },
        features: [],
        facts: [],
        pricing: [],
        integrations: [],
        cta: { primary: "", url, offer: "", secondary: "" },
        voice: { provider: "kokoro", voice: "af_heart", tone: "", wordsPerMinute: 150 },
        rules: { say: [], never: [] },
        ...captured,
        history: [],
      };
  brand.updated = date;
  writeFileSync(join(dir, "brand.json"), JSON.stringify(brand, null, 2) + "\n");
  try { rmSync(tmp, { recursive: true, force: true, maxRetries: 3 }); } catch { /* Windows may still hold Chrome's files; the OS cleans temp */ }

  console.log(`\nWrote brands/${slug}/ (${fonts.length} fonts, ${logoFiles.length} logos, ${shots.length} screenshots).`);
  console.log(`Next: fill identity, features, facts, pricing, cta and rules from ${textFile},`);
  console.log(`then set "status": "ready" and run: node scripts/brand.mjs check ${slug}`);
}

function check(slug) {
  const slugs = slug ? [slug] : listSlugs();
  if (!slugs.length) fail("no brands yet: node scripts/brand.mjs init <url>");
  let bad = 0;
  for (const s of slugs) {
    const dir = join(BRANDS, s);
    const brand = load(s);
    const { errors, warnings } = validateBrand(brand, { dir });
    console.log(`${errors.length ? "✗" : "✓"} ${s}  (${brand.facts?.length || 0} facts, ${brand.features?.length || 0} features, status ${brand.status})`);
    errors.forEach((e) => console.log(`    error: ${e}`));
    warnings.forEach((w) => console.log(`    warn:  ${w}`));
    if (errors.length) bad++;
  }
  process.exit(bad ? 1 : 0);
}

function list() {
  const slugs = listSlugs();
  if (!slugs.length) return console.log("no brands yet: node scripts/brand.mjs init <url>");
  for (const s of slugs) {
    const b = load(s);
    console.log(`${s.padEnd(24)} ${String(b.status).padEnd(6)} updated ${b.updated}  ${b.history?.length || 0} videos  ${b.website}`);
  }
}

function use(slug, videoDir) {
  const brand = load(slug);
  const src = join(BRANDS, slug);
  const out = join(resolve(videoDir), "assets", "brand");
  mkdirSync(out, { recursive: true });
  for (const sub of ["fonts", "logos"]) if (existsSync(join(src, "assets", sub))) cpSync(join(src, "assets", sub), join(out, sub), { recursive: true });
  writeFileSync(join(out, "brand.css"), brandCss(brand));
  console.log(`Copied ${slug} fonts and logos to ${shortPath(out)}, wrote brand.css.`);
}

// Kit-relative when inside the kit, absolute otherwise; forward slashes either way.
const shortPath = (p) => (relative(KIT, p).startsWith("..") ? p : relative(KIT, p)).replaceAll("\\", "/");

function log(slug, videoDir, { recipe }) {
  const brand = load(slug);
  const dir = resolve(videoDir);
  const renders = existsSync(join(dir, "renders")) ? readdirSync(join(dir, "renders")).filter((f) => /\.(mp4|webm|mov)$/.test(f)) : [];
  const video = shortPath(dir);
  brand.history = [...(brand.history || []).filter((h) => h.video !== video), { date: today(), video, recipe: recipe || "", renders }];
  brand.updated = today();
  writeFileSync(join(BRANDS, slug, "brand.json"), JSON.stringify(brand, null, 2) + "\n");
  console.log(`Logged ${basename(dir)} (${renders.length} renders) in brands/${slug}/brand.json.`);
}

const listSlugs = () => (existsSync(BRANDS) ? readdirSync(BRANDS).filter((d) => existsSync(join(BRANDS, d, "brand.json"))) : []);
function load(slug) {
  const p = join(BRANDS, slug, "brand.json");
  if (!existsSync(p)) fail(`brands/${slug}/brand.json not found. Known: ${listSlugs().join(", ") || "none"}`);
  return JSON.parse(readFileSync(p, "utf8"));
}
function fail(msg) { console.error(`brand: ${msg}`); process.exit(1); }

function main() {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: { slug: { type: "string" }, force: { type: "boolean" }, recipe: { type: "string" }, help: { type: "boolean", short: "h" } },
  });
  const [cmd, a, b] = positionals;
  if (cmd === "init" && a) return init(a, values);
  if (cmd === "check") return check(a);
  if (cmd === "list") return list();
  if (cmd === "use" && a && b) return use(a, b);
  if (cmd === "log" && a && b) return log(a, b, values);
  console.log(readFileSync(fileURLToPath(import.meta.url), "utf8").split("\n").slice(1, 9).map((l) => l.replace(/^\/\/ ?/, "")).join("\n"));
  process.exit(values.help ? 0 : 1);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) main();
