# buks plugins

Official extension repo for **Buks** (`app.orubus.buks`) — the Orubus reader.

- `index.json` — the extension index the app fetches (`Browse → Available`)
- `plugins/*.js` — one self-contained CommonJS bundle per source
- `vendor.js` — shared runtime modules (cheerio, dayjs, protobufjs, lib shims)

## Contents

- 187 English novel sources (compiled from the LNReader plugin ecosystem —
  MIT-licensed — via the buks build pipeline, quickjs-compatible ES5)
- 1 manga source: **MangaDex** (official JSON API), served through the buks
  manga plugin API (`popularManga/searchManga/mangaDetails/chapterList/pageList`)

## Adding a source

Plugins are CommonJS files exporting `exports.default = { id, name, site,
version, ... }` with the novel or manga method set. Build the index with the
pipeline in the main buks workspace and commit both the bundle and the index.
