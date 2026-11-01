# Biology coverage and cell reuse plan

Updated: 2026-10-31

Scope: biology lessons in the current catalog, the local `cell/` project, and the
Vietnamese Biology 10-12 source PDFs under `SGK/`. This report is intentionally
standalone. It does not change `catalog.json`, `app/legacy/manifest.json`, or any
course HTML.

## Executive summary

- The catalog currently has 12 Biology lessons.
- Five are phenomenon or experiment lessons implemented as procedural Three.js
  scenes: plasmolysis, membrane transport, nerve impulse, mitosis, and enzyme
  activity.
- Seven are cell-structure lessons routed through `courses/cell-viewer.html`.
- Five of those seven use local GLB assets. Muscle and epithelial tissue use
  procedural Three.js geometry.
- The local cell project has useful Biology 10-11 coverage, but it is not a
  complete Biology 10-12 curriculum. It is strongest for cell structure,
  neuron, immunity, epithelial transport, and muscle contraction.
- No Biology 12 lesson is currently present in the catalog. Existing cell assets
  can support only a small part of Biology 12, mainly cell division and the
  cellular layer of genetics. They should not be presented as full genetics,
  evolution, or ecology coverage.
- No model was downloaded or added for this report.

## Evidence and source boundaries

The local SGK files available for comparison are:

- `SGK/SGK Sinh học 10-mau.pdf`
- `SGK/SGK Sinh học 11-mau.pdf`
- `SGK/SGK Sinh học 12-mau.pdf`

The catalog currently stores textbook hints, not a canonical page-level
curriculum database. Therefore each mapping below distinguishes:

- `Mapped`: the current title and textbook string provide a clear chapter/topic
  match, but a page number is not asserted.
- `Candidate`: the concept is a reasonable reuse target, but the lesson title or
  exact edition alignment still needs teacher review.
- `Gap`: there is no current lesson or the existing asset is not an adequate
  representation of the topic.

Edition note: the current metadata mentions both KNTT and Cánh Diều for some
lessons. Chapter and lesson numbering can differ between editions, so the
edition label must remain visible in any future curriculum UI.

## Current Biology inventory

### Biology 10 and cell structure

| Current slug | Current title | SGK alignment in catalog | 3D implementation | Reuse decision |
|---|---|---|---|---|
| `cell-plant-step` | Cấu trúc tế bào thực vật | Sinh học 10, tế bào nhân thực; KNTT Bài 8 / Cánh Diều Bài 7 | Plant GLB | Mapped. Reuse directly; add focus states for wall, vacuole, chloroplast. |
| `cell-animal-step` | Cấu trúc tế bào động vật | Sinh học 10, tế bào nhân thực; KNTT Bài 8 / Cánh Diều Bài 7 | Animal GLB | Mapped. Reuse directly; add membrane, nucleus, mitochondrion and Golgi callouts. |
| `cell-bacteria-step` | Cấu trúc tế bào vi khuẩn | Sinh học 10, tế bào nhân sơ; KNTT Bài 7 / Cánh Diều Bài 6 | Bacteria-wall GLB | Mapped. Reuse directly; keep the prokaryote comparison state. |
| `plasmolysis-step` | Sự hút nước và mất nước của tế bào thực vật | Sinh học 10, vận chuyển thụ động and practical investigation | Procedural Three.js | Mapped. Reuse plant GLB as the context model, while retaining the current concentration/state controls. |
| `transport-step` | Vận chuyển qua màng | Sinh học 10, vận chuyển các chất vào và ra khỏi tế bào | Procedural Three.js | Mapped. Reuse plant or animal cell membrane context; keep molecule transport as procedural animation. |
| `mitosis-step` | Quan sát nguyên phân ở mô phân sinh đầu rễ | Sinh học 10, cell cycle and practical investigation | Procedural Three.js | Mapped. Reuse plant-cell visual language, but add explicit phase geometry and microscope-style view. |
| `enzyme-step` | Các điều kiện ảnh hưởng đến hoạt tính enzyme | Sinh học 10, enzyme and practical investigation | Procedural Three.js | Mapped. Keep the existing experiment. Reuse cell context only as optional context; do not force a cell GLB into the enzyme reaction. |

### Biology 11 and specialized cells

| Current slug | Current title | SGK alignment in catalog | 3D implementation | Reuse decision |
|---|---|---|---|---|
| `cell-neuron-step` | Cấu trúc tế bào thần kinh | Sinh học 11, cảm ứng ở động vật; KNTT Bài 17 / Cánh Diều Bài 13 | Neuron GLB | Mapped. Reuse directly; ideal base for impulse animation. |
| `impulse-step` | Sự phát sinh và dẫn truyền xung thần kinh | Sinh học 11, điều hòa thần kinh, Bài 3 in current metadata | Procedural Three.js | Mapped. Reuse neuron GLB for anatomy and keep the procedural membrane-potential experiment. |
| `cell-whiteblood-step` | Tế bào bạch cầu và cơ chế thực bào | Sinh học 11, miễn dịch ở động vật; KNTT Bài 12 / Cánh Diều Bài 11 | White blood cell GLB | Mapped. Reuse directly; the next improvement should animate pseudopodia and phagosome states. |
| `cell-epithelial-step` | Tế bào biểu mô and barrier function | Sinh học 11, dinh dưỡng and digestion; also linked to Sinh học 10 cell structure | Procedural Three.js | Mapped. Reuse directly; add a tissue cross-section and transport overlay rather than a new model. |
| `cell-muscle-step` | Cấu trúc sợi cơ and sliding filament | Sinh học 11, cảm ứng ở động vật; also linked to Sinh học 10 cell structure | Procedural Three.js | Mapped. Reuse directly; the current procedural sarcomere is the right asset for actin-myosin steps. |

The current catalog has useful Biology 11 topics, but it does not claim complete
coverage of the full grade. Topics such as endocrine regulation, circulation,
respiration, excretion, reproduction, and broader homeostasis are not represented
by a dedicated current lesson. Cell assets alone are not enough to fill those
gaps.

### Biology 12

There is currently no Biology 12 slug in the catalog. The cell package can help
with a limited foundation layer:

| SGK topic family | Current status | Safe reuse of `cell` |
|---|---|---|
| Cell division and chromosome behavior | Candidate | Reuse plant/animal procedural geometry from the cell visual language; extend `mitosis-step`. |
| DNA organization, replication, transcription, translation | Gap | Reuse existing procedural molecular/ball-and-stick techniques where appropriate, but no current cell GLB is a DNA lesson. |
| Mendelian genetics and population genetics | Gap | Do not use cell-viewer as the primary representation; build charts, crosses, and population simulations. |
| Evolution | Gap | No direct cell asset mapping. Use timelines, trees, and population visuals. |
| Ecology and ecosystems | Gap | No direct cell asset mapping. Use food webs, cycles, maps, and system simulations. |

This is a coverage assessment, not a claim that every official lesson title is
identical across KNTT and Cánh Diều. The three local PDFs should remain the
page-level source of truth when future curriculum records are created.

## `cell/` asset inventory

### Native GLB assets

| Asset | Approx. size | Current viewer | Recommended lessons |
|---|---:|---|---|
| `cell/public/models/plant-cell-first001.glb` | 56.5 MB | Plant cell | `cell-plant-step`, `plasmolysis-step`, `mitosis-step` |
| `cell/public/models/white-blood-cell-user.glb` | 53.9 MB | White blood cell | `cell-whiteblood-step` |
| `cell/public/models/neuron-nih.glb` | 2.8 MB | Neuron | `cell-neuron-step`, `impulse-step` |
| `cell/public/models/animal-cell-nih.glb` | 1.5 MB | Animal cell | `cell-animal-step`, `transport-step`, optional `mitosis-step` |
| `cell/public/models/bacteria-wall-nih.glb` | 0.5 MB | Bacteria cell wall | `cell-bacteria-step` |

### Procedural cell models

`cell/src/components/CellScene.tsx` provides procedural models for:

- epithelial cell;
- muscle fiber and sarcomere;
- bacteria fallback;
- animal and plant fallback states;
- neuron and white blood cell fallback states.

These are better suited than a static image for lessons that need state changes,
highlighting, or a cutaway. They can be reused without downloading assets.

### Preview and reference images

The PNGs under `cell/public/cell-renders/`,
`cell/public/cell-renders-transparent/`, and `cell/public/nih-previews/` are
preview, thumbnail, or reference assets. They are useful for cards and loading
states, not a substitute for an interactive 3D lesson.

## Proposed mapping without changing the catalog

The following is an implementation design, not a catalog mutation. A future
adapter can read this mapping from a separate coverage/config file or implement
it in the lesson integration layer.

| Lesson | Viewer mode | Base asset | Required state layer | Priority |
|---|---|---|---|---|
| `cell-plant-step` | Cell viewer | Plant GLB | Existing organelle focus and SGK labels | P0 |
| `cell-animal-step` | Cell viewer | Animal GLB | Existing organelle focus and comparison with plant | P0 |
| `cell-bacteria-step` | Cell viewer | Bacteria GLB | Wall, nucleoid, plasmid, flagellum labels | P0 |
| `cell-neuron-step` | Cell viewer | Neuron GLB | Soma, dendrite, axon, myelin, synapse focus | P0 |
| `cell-whiteblood-step` | Cell viewer | White blood GLB | Pseudopodia, lysosome, phagosome sequence | P0 |
| `cell-muscle-step` | Cell viewer | Procedural muscle | Sarcomere contraction and actin-myosin movement | P0 |
| `cell-epithelial-step` | Cell viewer | Procedural epithelial | Apical-basal polarity, microvilli, tight junctions | P0 |
| `plasmolysis-step` | Hybrid | Plant GLB + current procedural controls | Turgor, plasmolysis, deplasmolysis states | P1 |
| `transport-step` | Hybrid | Animal/plant membrane context + current procedural animation | Passive, facilitated, active, endo/exocytosis | P1 |
| `impulse-step` | Hybrid | Neuron GLB + current membrane experiment | Highlight signal path and synapse while preserving graph/control panel | P1 |
| `mitosis-step` | Hybrid | Plant/animal context + procedural chromosomes | Prophase, metaphase, anaphase, telophase, timing | P1 |
| `enzyme-step` | Existing procedural | Existing molecular/experiment scene | Optional cell context only | P2 |

## Integration constraints

1. Keep the existing lesson slugs and catalog untouched. The mapping belongs in
   a separate coverage document or future typed configuration.
2. Keep `cell-viewer.html` as the compatibility surface until the richer
   React/React Three Fiber app is deliberately integrated. Do not silently
   replace the iframe with a second router.
3. Reuse the existing legacy bridge protocol for `setStep`, `reset`, mode
   changes, and state reporting. The cell viewer already has the necessary
   concepts and should remain the single owner of its canvas.
4. Treat the large Plant and White Blood GLBs as lazy assets. They should not be
   requested until the corresponding lesson is opened.
5. The viewer currently imports Three.js from `esm.sh`. For a private or offline
   server, bundle or self-host that dependency before calling the deployment
   fully self-contained.
6. Preserve asset provenance from `cell/docs/ASSETS.md`. Do not redistribute
   the user-provided GLBs or NIH assets under a new license without review.

## Priority plan

### P0 - Stabilize current mapped lessons

- Verify the seven cell routes in the production artifact.
- Verify `ready`, `stepChanged`, `setStep`, reset, rotate, pan, zoom, and
  fullscreen for each cell type.
- Keep labels and explanatory text in the outer lesson shell so they remain
  available even if a model is still loading.

### P1 - Hybridize existing Biology experiments

- Add an optional context-model mode to plasmolysis, transport, impulse, and
  mitosis.
- Keep each experiment's current controls and equations; use the cell model for
  orientation and spatial explanation only.
- Add explicit step-to-organelle mappings instead of inferring them from title
  strings.

### P2 - Expand curriculum coverage

- Create a separate Biology 12 coverage plan for genetics, evolution, and ecology.
- Reuse procedural molecular geometry only where it improves understanding.
- Do not label a lesson as SGK-aligned until the edition and page have been
  checked against the relevant local PDF.

## Verification checklist for the next implementation pass

- [ ] Every current Biology slug has one explicit coverage record.
- [ ] Every record names its SGK edition, chapter, lesson, and page or marks the
      page as pending.
- [ ] Every cell step has a deterministic organelle/model target.
- [ ] Missing model fallback is visible and still leaves the lesson usable.
- [ ] The 56 MB and 54 MB GLBs are lazy-loaded and show progress.
- [ ] No new model download is required for the P0/P1 plan.
- [ ] Production smoke tests cover all seven cell routes.

