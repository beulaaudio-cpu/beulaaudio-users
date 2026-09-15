# BEULA AUDIO — 3D Asset & Blender Handoff Specification

This document provides exact guidelines and technical specifications for 3D artists creating or exporting assets for the **BEULA AUDIO** interactive stage experience.

---

## 1. Scene & Unit Conventions

| Parameter | Specification | Notes |
| :--- | :--- | :--- |
| **Unit System** | Metric | Ensure Blender Unit Scale = `1.0` |
| **Length Unit** | Meters (`m`) | Real-world concert dimensions |
| **Forward Axis** | `-Z` (glTF Standard) | Export with `+Y Up`, `+Z Forward` |
| **World Origin (0,0,0)** | Center of Stage Deck | The DJ booth / console sits atop (0, 0, 0) |
| **Stage Height** | `0.6m - 0.8m` from ground | Floor plane placed at `Y = 0` |

---

## 2. Semantic Object ID Naming Hierarchy

The Three.js runtime maps transforms, animations, and lighting focuses using exact object names. Name your Blender objects or top-level empties using the following canonical IDs:

### Core Audio Equipment
- `beula-speaker-vrx`: JBL VRX-style curved line array cluster (flown or ground-stacked).
- `beula-speaker-top`: Standard two-way point-source top speaker on stand.
- `beula-bass`: 18" high-power subwoofer cabinets (dual or single).
- `beula-dj-player`: Professional DJ deck/mixer console (Pioneer CDJ / DJM aesthetic).
- `beula-monitor`: Floor wedge monitor speaker (e.g. QSC K12 style).
- `beula-mic`: Cordless and corded dynamic stage microphones with boom stands.

### Stage Structure & Lighting
- `beula-truss`: 20ft × 60ft aluminum box truss system or hydraulic upright towers.
- `beula-honeycomb`: Hexagonal LED honeycomb backdrop fixture array.
- `beula-sharpy`: Beam moving-head sharp spot fixtures.
- `beula-parcan`: RGBW LED par cans (ambient wash lights).
- `beula-moving`: High-output wash/spot moving heads.
- `beula-spyder`: Multi-beam spyder moving beam bar.
- `beula-dandiya`: Effect light bar fixture.
- `beula-blinder`: 2-way or 4-way high-intensity stage audience blinders.
- `beula-smoke`: Hazer / smoke machine outlet nozzle.

---

## 3. Geometry & Budgeting Guidelines

To maintain 60+ FPS performance on desktop hardware:

- **Total Triangle Budget**: Under **150,000 triangles** for the combined stage environment.
- **Line Array speakers**: Max **8,000 triangles** per speaker module. Utilize normal maps for front grilles and side handles rather than modeling individual perforated holes.
- **Par Cans & Truss**: Max **2,500 triangles** per fixture. Use modular instances where possible.
- **Bevels**: Restrain high-segment bevel modifiers; bake hard-surface chamfers into normal maps.

---

## 4. Materials & Texturing (PBR Standard)

All assets must use the standard **glTF PBR Metallic-Roughness workflow**:

- **Base Color (Albedo)**: sRGB color space. Avoid pure black (`#000000`); use dark charcoal (`#121214`) for realistic acoustic carpet/wood.
- **Roughness**: Linear greyscale. Stage equipment should exhibit matte powder-coated steel (`0.35 - 0.65`) and textured ABS plastic (`0.4 - 0.7`).
- **Metallic**: Linear greyscale. Binary (`0.0` for plastics/fabrics, `1.0` for aluminum truss and fixture yokes).
- **Emissive**: Used for DJ displays, LED fixture lenses, and Honey Comb panels. Keep base values clean; the Three.js post-processing bloom pass will elevate intensity.
- **Texture Resolutions**:
  - Main hero assets (DJ console, front speakers): `2048x2048`
  - Structural elements (truss, floor): `1024x1024` tileable
  - Small fixtures (parcans, mics): `512x512` or packed atlas

---

## 5. GLB Export Settings (Blender 4.x / 3.x)

When exporting from Blender (`File > Export > glTF 2.0 (.glb)`):

1. **Format**: `glTF Binary (.glb)`
2. **Include**:
   - [x] Limit to: Selected Objects (or active Collection)
   - [x] Custom Properties: ON (preserves semantic tags)
3. **Transform**:
   - `+Y Up`: Checked
4. **Geometry**:
   - [x] Apply Modifiers: ON
   - [x] Normals: ON
   - [x] Tangents: ON (required for normal maps)
   - [x] Compression (Draco): Optional (recommended if file exceeds 15MB)
5. **Animation**:
   - If ambient camera sweeps or lighting movements are embedded, name the NLA track `StageAmbientAction`.

---

## 6. Integration in Codebase

Place the final exported file into:
```
public/models/beula-stage.glb
```

The runtime in `components/3d/AudioStageScene.tsx` automatically loads and aligns the model. If custom Blender names are used, add the mappings to `INVENTORY_MAPPING` in `lib/data/inventory.ts`.
