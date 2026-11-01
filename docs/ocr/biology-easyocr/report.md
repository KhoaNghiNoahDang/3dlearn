# Biology + cell EasyOCR and model capability report

Date: 2026-10-31  
Scope: SGK Sinh học 10-12, `cell/src`, `cell/public/models`,
`courses/cell-viewer.html`, and the two Phase 2 adapters.

## Executive result

- EasyOCR is installed and importable, but its detector weights are not cached.
- Offline initialization failed because `craft_mlt_25k.pth` is missing.
- A download-enabled initialization was attempted, but did not complete in the
  available run window. No EasyOCR text result is claimed.
- SGK evidence was retained as rendered images and the naming records are marked
  `needs-review`. The official-topic names in the JSON are a visual fallback,
  not a completed EasyOCR extraction.
- The local cell project contains five GLBs and procedural fallbacks for plant,
  animal, bacteria, neuron, white blood cell, muscle, and epithelial views.
- Two P0 lessons are now genuinely stateful in `cell-viewer.html`:
  `phase2-bio-mitosis` and `phase2-bio-osmosis`.

## OCR status and evidence

EasyOCR check:

```text
easyocr: importable
torch: available
cv2: available
offline Reader(['vi', 'en']): failed
reason: Missing C:\Users\Admin/.EasyOCR/model/craft_mlt_25k.pth
download-enabled Reader: attempted, not completed
```

Rendered evidence:

- [Sinh học 10 mục lục](../biology-final/sinh10-toc.png) - PDF page 5, printed page 4.
- [Sinh học 11 mục lục](../biology-final/sinh11-toc.png) - PDF page 6, printed page 4.
- [Sinh học 12 mục lục](../biology-final/sinh12-toc.png) - PDF page 6, printed page 4.

The machine-readable naming and model map is in
`content/phase2/naming-biology-easyocr.json`. It records the failed OCR state,
source pages, visual fallback names, review requirements, and exact local model
paths.

## Exact local model and logic inventory

### GLB assets

| Local path | Approx. size | Existing logic | Safe curriculum use |
|---|---:|---|---|
| `cell/public/models/plant-cell-first001.glb` | 56.5 MB | `cell-viewer` plant config; GLTFLoader; organelle focus; Phase 2 overlays | Plant cell structure, mitosis context, osmosis/plasmolysis context |
| `cell/public/models/animal-cell-nih.glb` | 1.5 MB | Animal config; membrane/nucleus/mitochondria/Golgi focus | Animal cell structure and membrane context |
| `cell/public/models/bacteria-wall-nih.glb` | 0.5 MB | Bacteria config; wall/nucleoid/flagellum focus | Prokaryote structure |
| `cell/public/models/neuron-nih.glb` | 2.8 MB | Neuron config; soma/axon/synapse focus | Neuron structure; impulse context |
| `cell/public/models/white-blood-cell-user.glb` | 53.9 MB | White blood config; nucleus/lysosome focus | Immune-cell structure and phagocytosis context |

### Procedural logic

`cell/src/components/CellScene.tsx` contains procedural model branches for plant,
animal, bacteria, neuron, white blood cell, muscle, and epithelial views. The
React cell app also provides `viewMode` mesh/focus and `crossSection` controls.

`courses/cell-viewer.html` independently provides:

- Three.js `WebGLRenderer`.
- `OrbitControls`.
- `GLTFLoader`.
- procedural fallback geometry for unavailable GLBs.
- organelle chips and step rail.
- cutaway, reset, auto-rotate, bridge `setStep`, `setMode`, `reset`, and state.

The React cell app and the legacy `cell-viewer.html` are parallel renderers. The
Phase 2 implementation deliberately extends the legacy viewer because that is
the current course iframe/bridge surface; it does not silently replace the
React app router.

## P0 integration completed

### 1. `phase2-bio-mitosis`

Official SGK names:

- `Chu kì tế bào và nguyên phân`.
- Related practice: `Thực hành: Làm và quan sát tiêu bản quá trình nguyên phân và giảm phân`.

Implementation:

- Reuses `plant-cell-first001.glb`.
- Adds six procedural chromosome proxies.
- Adds two spindle poles and spindle lines.
- Updates the overlay for preparation, prophase, metaphase, anaphase, telophase,
  and cytokinesis.
- Keeps the existing plant model, organelle focus, step rail, bridge, reset,
  fullscreen, rotate/pan/zoom behavior.

Important boundary: this is real visual state logic for mitosis, but it does not
implement meiosis. The adapter and naming map explicitly preserve that boundary.

### 2. `phase2-bio-osmosis`

Official SGK names:

- `Trao đổi chất qua màng tế bào`.
- Related practice: `Thực hành: Thí nghiệm co và phản co nguyên sinh`.

Implementation:

- Reuses `plant-cell-first001.glb`.
- Adds a procedural translucent vacuole proxy.
- Adds a procedural membrane shell/wireframe.
- Changes vacuole scale and membrane separation across the six steps:
  initial, hypotonic, turgor, hypertonic, plasmolysis, deplasmolysis.
- Keeps the existing controls and bridge.

Important boundary: the current state is qualitative. It does not yet expose
numeric concentration, water potential, turgor pressure, or measured data.

## Capability matrix requested by topic

| Topic | Best local base | Current status | Safe next step |
|---|---|---|---|
| Nguyên phân | Plant GLB + procedural chromosome overlay | Implemented P0 | Add microscope/slide mode and teacher-reviewed phase timing |
| Giảm phân | Reusable chromosome overlay only | Missing | Add a separate meiosis state machine; do not reuse mitosis labels |
| Màng tế bào | Animal/plant GLB + cross-section/procedural shell | Partial | Add explicit membrane layer and transport channels |
| Vận chuyển | Existing `transport-step` procedural scene | Partial | Keep experiment owner there; use cell viewer only for membrane context |
| Co nguyên sinh | Plant GLB + vacuole/membrane overlay | Implemented P0 qualitative | Add concentration/turgor sliders and measured output |
| Enzyme | Existing procedural enzyme experiment | Partial | Improve substrate/active-site/pH/temperature states; cell GLBs are context only |
| Neuron | Neuron GLB + procedural neuron fallback | Structure covered, process partial | Synchronize impulse-step signal path with soma/axon/synapse focus |
| Cơ | Procedural muscle/sarcomere | Structure partial | Animate actin-myosin sliding and Ca2+ cycle |
| Biểu mô | Procedural epithelial | Structure partial | Add apical-to-basal transport and barrier permeability states |

## SGK coverage gaps

### Sinh học 10

Existing local support is strongest for:

- Tế bào nhân sơ.
- Tế bào nhân thực.
- Trao đổi chất qua màng.
- Co và phản co nguyên sinh.
- Chu kì tế bào/nguyên phân.
- Enzyme.

Still missing or only partial:

- Giảm phân and the combined mitosis/meiosis practical.
- Truyền tin tế bào.
- Công nghệ tế bào.
- Vi sinh vật and fermentation practicals.
- Virus and virus investigation practical.

### Sinh học 11

Existing local support is strongest for neuron, immune-cell structure, epithelial
structure, and muscle structure. The following remain missing or only contextual:

- Trao đổi nước/khoáng, quang hợp, hô hấp ở thực vật.
- Hô hấp, tuần hoàn, bài tiết, cân bằng nội môi ở động vật.
- Cảm ứng ở thực vật.
- Sinh trưởng/phát triển and reproduction.
- Full digestion and immune-response process simulations.

### Sinh học 12

No Biology 12 catalog lesson is present. Missing families are:

- DNA, replication, gene expression, gene regulation, mutation, gene technology.
- Chromosome genetics, Mendel extensions, linkage, human genetics.
- Population genetics.
- Evolution.
- Population/community/ecosystem ecology, restoration, conservation, and
  sustainability.

Cell assets can provide a context layer for DNA/chromosome lessons later, but
cannot substitute for genetics data simulations, phylogenetic trees, or ecosystem
models.

## Verification performed

- EasyOCR import check: PASS.
- EasyOCR offline weight check: FAIL as expected; weight absent.
- Rendered SGK evidence paths: present.
- JSON parse for `content/phase2/naming-biology-easyocr.json`: PASS.
- JavaScript syntax check for `cell-viewer` and both Phase 2 adapters: PASS.
- Root production build and release validation after the P0 viewer change: PASS
  (`npm run build`, 68 course HTML files staged, 85 local references resolved).
  This does not replace a browser runtime smoke test for every GLB.

## Constraints respected

- No external 3D model was downloaded.
- No catalog or shared manifest was changed.
- Only existing GLB files and procedural Three.js geometry were used.
- Phase 2 remains additive and isolated from the shared catalog.

