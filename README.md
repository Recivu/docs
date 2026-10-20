# Recivu API docs

Documentazione pubblica della Recivu API, pubblicata con [Mintlify](https://mintlify.com). Ogni push su `main` va online da solo: le PR puntano a `main`.

| File | Cosa contiene |
| --- | --- |
| `openapi.yaml` | Il contratto con i partner. Mintlify ne ricava la tab **API reference**. |
| `CHANGELOG.md` | Fonte del changelog ([Keep a Changelog](https://keepachangelog.com)). |
| `changelog.mdx` | Pagina Changelog, **generata** da `CHANGELOG.md`: non modificarla a mano. |
| `*.mdx` | Le guide (introduzione, autenticazione, sandbox, webhook, rate limiting, errori). |
| `docs.json` | Navigazione, tema, logo, playground. |

## Modificare il contratto

1. Cambia `openapi.yaml`.
2. Aggiungi la voce in `CHANGELOG.md` sotto `## [Unreleased]`; le modifiche breaking iniziano con `**BREAKING:**`.
3. Al rilascio bumpa `info.version` (semver) e rinomina `[Unreleased]` in `[X.Y.Z] - YYYY-MM-DD`, nello stesso commit.
4. Rigenera la pagina: `node scripts/gen-changelog.mjs`.

La CI (`validate-spec`) controlla la spec con Redocly, l'allineamento versione/changelog, che `changelog.mdx` sia rigenerato, la build Mintlify e i link rotti.

## Anteprima locale

```bash
npx mint dev
```

Apri `http://localhost:3000`. Prima di aprire la PR: `npx mint validate && npx mint broken-links`.
