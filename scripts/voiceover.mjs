#!/usr/bin/env node
// ElevenLabs voiceover with word timings in one call.
// Writes <out> (mp3) and <out minus ext>.words.json in the HyperFrames captions shape:
//   [{ "id": "w0", "text": "Hello", "start": 0.0, "end": 0.42 }, ...]
// Usage: node scripts/voiceover.mjs <script.txt> -o <narration.mp3> [--voice id] [--model id] [--speed n]
// Needs ELEVENLABS_API_KEY in the environment or in .env. No dependencies (Node 22+).

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { parseArgs } from "node:util";
import { pathToFileURL } from "node:url";

const DEFAULT_VOICE = "SAz9YHcvj6GT2YYXdXww"; // River: relaxed, neutral, informative
const DEFAULT_MODEL = "eleven_multilingual_v2";
const MAX_CHARS = 5000;

// Group ElevenLabs character alignment into words split on whitespace.
export function alignmentToWords({ characters, character_start_times_seconds: starts, character_end_times_seconds: ends }) {
  const words = [];
  let text = "";
  let start = 0;
  let end = 0;
  const flush = () => {
    if (text) words.push({ id: `w${words.length}`, text, start: round(start), end: round(end) });
    text = "";
  };
  characters.forEach((ch, i) => {
    if (/\s/.test(ch)) return flush();
    if (!text) start = starts[i];
    text += ch;
    end = ends[i];
  });
  flush();
  return words;
}

const round = (n) => Math.round(n * 1000) / 1000;

async function main() {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      out: { type: "string", short: "o" },
      voice: { type: "string", default: DEFAULT_VOICE },
      model: { type: "string", default: DEFAULT_MODEL },
      speed: { type: "string" },
      help: { type: "boolean", short: "h" },
    },
  });
  if (values.help || positionals.length !== 1 || !values.out) {
    console.log("Usage: node scripts/voiceover.mjs <script.txt> -o <narration.mp3> [--voice id] [--model id] [--speed 0.7-1.2]");
    process.exit(values.help ? 0 : 1);
  }

  try { process.loadEnvFile(".env"); } catch { /* no .env is fine */ }
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) fail("ELEVENLABS_API_KEY is not set. Add it to .env (see .env.example) or use the free Kokoro path.");

  const text = (await readFile(positionals[0], "utf8")).trim();
  if (!text) fail(`${positionals[0]} is empty.`);
  if (text.length > MAX_CHARS) fail(`Script is ${text.length} characters; split it under ${MAX_CHARS} and run once per part.`);

  const body = { text, model_id: values.model };
  if (values.speed) body.voice_settings = { speed: Number(values.speed) };

  const url = `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(values.voice)}/with-timestamps?output_format=mp3_44100_128`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "xi-api-key": key, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) fail(`ElevenLabs ${res.status}: ${await res.text()}`);
  const data = await res.json();

  const out = resolve(values.out);
  const wordsPath = out.replace(/\.[^.\\/]+$/, "") + ".words.json";
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, Buffer.from(data.audio_base64, "base64"));
  const words = alignmentToWords(data.alignment);
  await writeFile(wordsPath, JSON.stringify(words, null, 2));

  const seconds = words.length ? words[words.length - 1].end : 0;
  console.log(`wrote ${out} (${seconds.toFixed(1)} s, ${words.length} words)`);
  console.log(`wrote ${wordsPath}`);
}

function fail(msg) {
  console.error(`voiceover: ${msg}`);
  process.exit(1);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) main();
