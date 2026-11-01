# Legacy lesson compatibility layer

This directory is the integration boundary for the existing self-contained lessons in `courses/*.html`.
It intentionally does not modify those lesson files and does not depend on `content/`.

## Integration

```js
import {
  createLegacyIframe,
  getLegacyRoute,
  loadLegacyManifest,
} from './app/legacy/adapter.js';

const manifest = await loadLegacyManifest();
const lesson = createLegacyIframe('capacitor-step', { manifest });
document.querySelector('#lesson-host').replaceChildren(lesson);

// Future app-shell route: /legacy/capacitor-step
history.pushState({}, '', getLegacyRoute('capacitor-step', { manifest }));
```

The adapter uses the manifest as an allowlist. Unknown slugs, path traversal,
and arbitrary file paths are rejected before an iframe is created. The default
iframe sandbox preserves the trusted local lesson's WebGL, pointer lock, and
fullscreen behavior while preventing top-level navigation. The default opaque
sandbox origin intentionally isolates legacy `localStorage`; callers that have
reviewed a deployment and need same-origin storage may explicitly pass a
custom `sandbox` option.

## 3D bridge

`scripts/bridge/legacy-bridge.js` is injected into every legacy course during
`npm run stage-release` and by the Vite dev transform during local work. The
shell and course communicate with `postMessage` using protocol
`3dlearn:legacy-bridge`, version `1`:

- `setMode` with `{ payload: { mode: 'rotate' | 'pan' | 'zoom' } }` changes the
  selected mouse gesture without depending on minified Three.js names.
- `reset` reloads the current course, which is the only consistent reset across
  all 54 self-contained experiments.
- `setStep` with `{ payload: { index } }` clicks the shared legacy step chip
  when one exists; lessons without that UI continue to work normally.
- `ready`, `stepChanged`, `modeChanged`, `state` and `ack` report bridge state
  back to the shell. Commands are accepted only from the exact
  `window.parent` reference and an origin matching the embedding app (with
  `null` allowed only for the intentionally opaque sandbox origin).

The iframe intentionally does not use `allow-same-origin`; this keeps the
legacy document isolated while still allowing the explicit message contract.
Because that produces an opaque origin, parent-to-iframe messages use the
required `*` target origin, while both sides authenticate the message source
and validate the protocol/version/type. Do not add `allow-same-origin` without
revisiting this threat model.
If legacy files are deployed on a separate origin, deploy the bridge script
there too and update the app CSP `frame-src` to that origin.

## Manifest

`manifest.json` is generated from the existing `catalog.json` and the actual
files in `courses/`. It contains all 54 lessons, their Vietnamese catalog
metadata, source HTML/cover references, iframe paths, and a deliberately
conservative curriculum status: `needs-book-page-mapping`.

The current catalog is a useful topic candidate list, not yet the source of
truth for the Vietnamese SGK. Once OCR/manual review maps a lesson to one of
the PDFs in `SGK/`, fill `curriculum.sourceBooks` and change the status in a
separate content/mapping layer; do not change the legacy HTML.

## Regeneration and verification

From the repository root, run:

```bash
node app/legacy/build-manifest.mjs
```

The build fails if the catalog and `courses/*.html` counts differ, if a slug is
unsafe, or if a catalog entry has no matching HTML file. This is intentionally
separate from the future UI shell so the compatibility layer can be adopted
incrementally.

