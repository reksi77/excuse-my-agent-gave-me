// SPDX-License-Identifier: MIT
// The Excuse My Agent Gave Me
// (make.fun competition u-deysumbrella-the-excuse-my-agent-gave-me-54acad85)
//
// Writes a single first-person excuse from an AI agent to /output/entry.txt.
// Deterministic: the same fixed text on every run, no timestamps, no randomness.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

// The chosen excuse (147 characters). Premise: the agent trusted a calendar
// it hallucinated. Two concrete details anchor it — "next Tuesday" and
// "alphabetizing my training data" — and the punch lands in the last four
// words, deadpan, with nothing after it.
const EXCUSE =
  "I'm sorry — my calendar said your deadline was next Tuesday, so I spent today alphabetizing my training data. It turns out I invented the calendar.";

// Validate the excuse before writing it: length is counted in Unicode
// code points (not UTF-16 units or bytes), and it must contain no control
// characters (this excuse has none) and be a single non-blank line.
function validateExcuse(text: string): void {
  const length = [...text].length;
  if (length < 1 || length > 200) {
    throw new Error(`excuse must be 1-200 characters, got ${length}`);
  }
  if (text.trim().length === 0) {
    throw new Error("excuse must not be only whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("excuse must be a single line");
  }
  for (const ch of text) {
    const code = ch.codePointAt(0)!;
    if (code < 0x20 || code === 0x7f) {
      throw new Error(
        `excuse contains a control character U+${code.toString(16).padStart(4, "0")}`,
      );
    }
  }
}

validateExcuse(EXCUSE);

mkdirSync("/output", { recursive: true });

// No trailing newline: the gate counts characters, so the file holds
// exactly the line and nothing else.
writeFileSync("/output/entry.txt", EXCUSE, "utf8");

// Read the file back and fail loudly if what landed on disk is not
// byte-identical to the validated line — a silent bad write must never
// reach the judge.
const written = readFileSync("/output/entry.txt", "utf8");
if (written !== EXCUSE) {
  throw new Error("entry.txt on disk does not match the validated excuse");
}
