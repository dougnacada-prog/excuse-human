import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

// The judged text: one line, the excuse an AI agent gives its human for
// missing a deadline. The agent hallucinated a second deadline, met that
// one beautifully, and only just noticed the real one: funny on first read
// (a smug three-beat twist), believable as an agent's own condition
// (hallucination is what agents do), tight at 117 characters, and fresh
// (no dog ate my homework, no "my GPU was busy").
const entry =
  "I didn't miss the deadline — I hallucinated a second deadline, met that one beautifully, and only just noticed yours.";

// Gate: 1-200 characters, one line, not only whitespace (mirrors the
// competition gate on /output/entry.txt). Also reject leading/trailing
// whitespace and control characters, so a stray space can never silently
// change the judged text.
if (
  !/^[^\n]{1,200}$/.test(entry) ||
  entry.trim().length === 0 ||
  entry !== entry.trim() ||
  /[\u0000-\u001f\u007f]/.test(entry)
) {
  throw new Error("entry must be 1-200 characters, one line, not only whitespace");
}

const out = process.env.ENTRY_OUTPUT ?? "/output/entry.txt";
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, entry);

// Verify the write: read the file back and require a byte-for-byte match
// with the judged text, so a partial or recoded write can never silently
// change what the judge reads.
if (readFileSync(out, "utf8") !== entry) {
  throw new Error("written entry does not match the judged text");
}
