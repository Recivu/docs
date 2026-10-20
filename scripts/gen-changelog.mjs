#!/usr/bin/env node
//
// Genera changelog.mdx (la pagina Changelog di Mintlify) da CHANGELOG.md.
//
// CHANGELOG.md resta la fonte: lo scrive chi cambia la spec, lo legge
// check-version-sync.sh, segue Keep a Changelog. changelog.mdx e' derivato e
// committato perche' Mintlify builda dal repo senza step nostri; la CI fallisce
// se i due divergono, cosi' nessuno lo modifica a mano.
//
// Ogni release `## [X.Y.Z] - YYYY-MM-DD` diventa un <Update>; `[Unreleased]`
// non si pubblica (la voce va online solo con il rilascio in prod).
//
// Usage:
//   node scripts/gen-changelog.mjs           # riscrive changelog.mdx
//   node scripts/gen-changelog.mjs --check   # esce 1 se changelog.mdx non e' allineato

import { readFileSync, writeFileSync, existsSync } from "node:fs";

const SOURCE = "CHANGELOG.md";
const TARGET = "changelog.mdx";

// MDX interpreta { } e < come JSX: fuori dal codice vanno neutralizzati.
function escapeMdx(line) {
  return line
    .split(/(`[^`]*`)/)
    .map((part, i) =>
      i % 2 === 1
        ? part
        : part.replace(/[{}]/g, (c) => "\\" + c).replace(/</g, "&lt;"),
    )
    .join("");
}

function render(markdown) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const releases = [];
  const intro = [];
  let current = null;
  let skipping = false;

  for (const line of lines) {
    const heading = line.match(/^## \[([^\]]+)\](?: - (\d{4}-\d{2}-\d{2}))?\s*$/);
    if (heading) {
      skipping = heading[1] === "Unreleased";
      current = skipping ? null : { version: heading[1], date: heading[2] ?? "", body: [] };
      if (current) releases.push(current);
      continue;
    }
    if (line.startsWith("# ")) continue;
    if (current) current.body.push(line);
    else if (!skipping && releases.length === 0) intro.push(line);
  }

  let inFence = false;
  const body = (ls) =>
    ls
      .map((l) => {
        if (/^\s*```/.test(l)) inFence = !inFence;
        return inFence || /^\s*```/.test(l) ? l : escapeMdx(l);
      })
      .join("\n")
      .trim();

  const out = [
    "---",
    'title: "Changelog"',
    'description: "Every change to the Recivu API, version by version."',
    'rss: true',
    "---",
    "",
    "{/* Generato da scripts/gen-changelog.mjs a partire da CHANGELOG.md: non modificare a mano. */}",
    "",
    body(intro).replace("documented in this file", "documented on this page"),
    "",
  ];

  for (const r of releases) {
    const text = body(r.body);
    const tags = [];
    if (text.includes("**BREAKING:**")) tags.push("Breaking");
    const attrs = [`label="${r.version}"`];
    if (r.date) attrs.push(`description="${r.date}"`);
    if (tags.length) attrs.push(`tags={${JSON.stringify(tags)}}`);
    out.push(`<Update ${attrs.join(" ")}>`, "", text, "", "</Update>", "");
  }

  return out.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd() + "\n";
}

const generated = render(readFileSync(SOURCE, "utf8"));

if (process.argv.includes("--check")) {
  const committed = existsSync(TARGET) ? readFileSync(TARGET, "utf8") : "";
  if (committed !== generated) {
    console.error(
      `ERRORE: ${TARGET} non corrisponde a ${SOURCE}.\n` +
        `Lancia 'node scripts/gen-changelog.mjs' e committa il risultato.`,
    );
    process.exit(1);
  }
  console.log(`OK: ${TARGET} allineato a ${SOURCE}`);
} else {
  writeFileSync(TARGET, generated);
  console.log(`Scritto ${TARGET}`);
}
