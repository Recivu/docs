# Documentation project instructions

## About this project

- Public documentation of the Recivu API, built on [Mintlify](https://mintlify.com). Every push to `main` is live.
- `openapi.yaml` is the API contract and generates the **API reference** tab.
- Guides are MDX files with YAML frontmatter; configuration lives in `docs.json`.
- `changelog.mdx` is generated from `CHANGELOG.md` by `node scripts/gen-changelog.mjs`. Never edit it by hand.

## Changing the contract

- Every change to `openapi.yaml` adds an entry to `CHANGELOG.md` under `## [Unreleased]`, in the same commit, using Keep a Changelog categories.
- Bump `info.version` per semver (MAJOR for anything breaking, MINOR for backwards-compatible additions, PATCH for documentation only). Prefix breaking entries with `**BREAKING:**`.
- When releasing, rename `[Unreleased]` to `[X.Y.Z] - YYYY-MM-DD`, open a new empty `[Unreleased]` above it, then regenerate `changelog.mdx`.
- Run `npx mint validate`, `npx mint broken-links` and `scripts/ci/check-version-sync.sh` before opening a PR.

## Terminology

- Use the Italian fiscal terms where partners meet them: _scontrino_ (fiscal receipt), _fattura elettronica_, IVA, P.IVA, _ragione sociale_, SDI, PEC.
- "Partner" is the platform integrating the API; "company" is the partner's customer that recovers VAT; "employee" submits receipts; "merchant" issues them.

## Style preferences

- Write in English, like the spec.
- Use active voice and second person ("you"). One idea per sentence.
- Use sentence case for headings.
- Code formatting for endpoints, fields, headers and values.
- Never use em dashes in new text.

## Content boundaries

- Document only what partners can call or receive. Never describe internal services, queues, validation codes or infrastructure.
