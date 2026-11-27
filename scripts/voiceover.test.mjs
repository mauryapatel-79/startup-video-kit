import { test } from "node:test";
import assert from "node:assert/strict";
import { alignmentToWords } from "./voiceover.mjs";

test("groups characters into words with first-start and last-end timings", () => {
  const text = "Ship  faster.\nToday";
  const characters = [...text];
  const starts = characters.map((_, i) => i * 0.1);
  const ends = characters.map((_, i) => i * 0.1 + 0.08);
  const words = alignmentToWords({ characters, character_start_times_seconds: starts, character_end_times_seconds: ends });
  assert.deepEqual(words, [
    { id: "w0", text: "Ship", start: 0, end: 0.38 },
    { id: "w1", text: "faster.", start: 0.6, end: 1.28 },
    { id: "w2", text: "Today", start: 1.4, end: 1.88 },
  ]);
});

test("empty alignment gives no words", () => {
  assert.deepEqual(alignmentToWords({ characters: [], character_start_times_seconds: [], character_end_times_seconds: [] }), []);
});
