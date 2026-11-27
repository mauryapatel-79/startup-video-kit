import { test } from "node:test";
import assert from "node:assert/strict";
import { slugify, guessPrimary, isVivid, classifyLogo, validateBrand, brandCss, normalizeUrl } from "./brand.mjs";

test("normalizeUrl adds https and refuses anything shell-like", () => {
  assert.equal(normalizeUrl("selixer.com"), "https://selixer.com/");
  assert.equal(normalizeUrl("https://acme.io/pricing?x=1"), "https://acme.io/pricing?x=1");
  assert.throws(() => normalizeUrl("acme.io & calc"));
  assert.throws(() => normalizeUrl('acme.io/"x'));
  assert.throws(() => normalizeUrl("ftp://acme.io"));
});

test("slugify takes the domain name from URLs and plain names", () => {
  assert.equal(slugify("https://www.selixer.com/pricing"), "selixer");
  assert.equal(slugify("acme.io"), "acme");
  assert.equal(slugify("My Brand Co"), "my-brand-co");
});

test("isVivid rejects dark and grey colours", () => {
  assert.equal(isVivid("#4B1DF2"), true);
  assert.equal(isVivid("#111827"), false);
  assert.equal(isVivid("#E5E5E5"), false);
});

test("guessPrimary takes the most-used vivid page colour, snapped to its CSS variable", () => {
  // selixer.com: two purple variables; the page mostly renders #4C1EF1 (= --selixer-electric-core)
  const css = { "--selixer-deep-node": "#4218d9", "--selixer-electric-core": "#4b1df2", "--accent": "#ede9fe", "--foreground": "#111827" };
  assert.equal(guessPrimary(css, ["#111827", "#4C1EF1", "#E5E5E5", "#4218D9"]), "#4B1DF2");
  assert.equal(guessPrimary({}, ["#111827", "#F9FAFB", "#00BA76"]), "#00BA76");
  assert.equal(guessPrimary({ "--primary": "#e11d48" }, ["#111827"]), "#E11D48");
  assert.equal(guessPrimary({}, []), "#111827");
});

test("classifyLogo tells a wordmark from a mark by its viewBox", () => {
  assert.equal(classifyLogo('<svg viewBox="0 0 1070 150">'), "wordmark");
  assert.equal(classifyLogo('<svg viewBox="0 0 1000 710">'), "mark");
  assert.equal(classifyLogo("<svg>"), null);
});

const ready = {
  name: "Acme", website: "https://acme.io", status: "ready",
  identity: { oneLiner: "Acme does X." },
  cta: { primary: "Start free", url: "https://acme.io" },
  features: [{ name: "X" }],
  visual: { colors: { primary: "#4B1DF2" }, fonts: [{ family: "Inter", file: "assets/fonts/inter.woff2" }], logos: { wordmark: "assets/logos/w.svg" } },
  facts: [{ id: "users", claim: "10,000 teams", source: "https://acme.io", captured: "2026-11-01", verified: true }],
};

test("a complete brand validates clean", () => {
  const r = validateBrand(ready, { exists: () => true, now: "2026-11-27" });
  assert.deepEqual(r, { errors: [], warnings: [] });
});

test("missing files, bad colours and unsourced facts are errors; old or unverified facts warn", () => {
  const b = structuredClone(ready);
  b.visual.colors.bg = "white";
  b.facts.push({ claim: "best in class" });
  b.facts[0].captured = "2025-01-01";
  b.facts[0].verified = false;
  const r = validateBrand(b, { exists: () => false, now: "2026-11-27" });
  assert.ok(r.errors.some((e) => e.includes("font file missing")));
  assert.ok(r.errors.some((e) => e.includes("logo wordmark missing")));
  assert.ok(r.errors.some((e) => e.includes("visual.colors.bg")));
  assert.ok(r.errors.some((e) => e.includes("needs claim, source and captured")));
  assert.ok(r.warnings.some((w) => w.includes("days old")));
  assert.ok(r.warnings.some((w) => w.includes("not verified")));
});

test("brandCss writes font faces with project-relative paths and colour variables", () => {
  const css = brandCss(ready);
  assert.match(css, /src: url\("assets\/brand\/fonts\/inter\.woff2"\)/);
  assert.match(css, /--brand-primary: #4B1DF2;/);
  assert.match(css, /--brand-font: "Inter", sans-serif;/);
});

test("brandCss picks a text face, not a mono or symbol font, as --brand-font", () => {
  const b = { name: "S", visual: { colors: {}, fonts: [{ family: "Geist Mono", file: "assets/fonts/gm.woff2" }, { family: "DirhamSign", file: "assets/fonts/d.woff2" }, { family: "Geist", file: "assets/fonts/g.woff2" }] } };
  assert.match(brandCss(b), /--brand-font: "Geist", sans-serif;/);
});
