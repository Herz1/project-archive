# Third-party notices

## Source snapshots

The integration keeps selected upstream files byte-for-byte. Paths below are relative to:

`.agents/skills/rhine-eidolon-preserve/assets/upstream/`

| Source | Pinned revision | Original licensing files |
| --- | --- | --- |
| LBEILC/RhineLabUI | 12cc5e4013acb9408f753ff71de6b8492299b7c8 | rhine/LICENSE; rhine/PR15-ATTRIBUTION.md |
| Sallyn0225/eidolon-sc | cd1c61751eddeaf1bd4cdef4133e5e67f3af4ec5 | eidolon/LICENSE; eidolon/LICENSING.md |

Original copyright notices and credits remain in those snapshots. The repository-level AGPL-3.0-or-later license covers the new integration, adapters and documentation; it does not replace more specific upstream or asset licenses.

## Bundled assets

- Rhine MiSans: `rhine/public/fonts/NOTICE.txt`, `MiSans-license.pdf`, and the notices within the versioned font directory.
- Rhine rolling-number and audio: `rhine/public/licenses/rolling-number.txt` and `rhine/public/audio/`.
- Eidolon landing fonts: OFL files beside `eidolon/frontend/src/app/(landing)/fonts/`.
- Phone model: Ranguel, “iPhone 17 Pro”, CC BY 4.0. The upstream adaptation changes materials, textures and packaging. Author, original source and changes remain in `eidolon/frontend/public/landing/phone/CREDITS.md`.
- Spine runtime: `eidolon/frontend/public/vendor/spine-3.6/LICENSE`. This runtime has its own license; Eidolon's additional AGPL permission remains in `LICENSING.md`.
- Eidolon sounds: `eidolon/frontend/public/sounds/CREDITS.md`.

## Not redistributed

The privately licensed Novecento font kit is absent. Rhine's authored phrase-art fallback remains available. No official-owner deployment identity is used to retrieve that font.

The original Eidolon deployment's externally hosted stand images, voice recordings, call posters, voxel figures and memory still are absent. The fixture clears those URLs and the original UI uses its own missing-asset fallbacks. Unrelated bar/gift images and backend services are also omitted.

The research screenshots retain original-site imagery for reference analysis. They are evidence, not an asset collection licensed for use as personal branding.

## Adaptation record

The source layer has no integration edits. Materialization creates an editable copy and records applied adapters in `reference-kit.json`. The small Eidolon adapters replace backend-fed entry data and local preview interfaces; they do not rewrite its visual modules.

The personal website additionally adapts copies in `website/archive` and `website/intro`; the immutable source layer above is unchanged. Rhine's MIT license is retained in its working copy. The adapted Eidolon frontend and new integration code are distributed under the root AGPL-3.0-or-later license. Source is linked in the website footer and `/about/`.

The personal site retains original shaders, timeline, glass and phone geometry, animation systems, font families and supplied attribution files. Project data, branding, links, deployment paths and variable-length navigation are adapted. New Chinese WOFF2 subsets use official Noto CJK fonts under SIL OFL. Personal boot phrase artwork reuses supplied original glyph outlines where available and uses Noto outlines for missing characters; no commercial font binaries were added. Procedural project actors use the upstream colour-block fallback, without redistributed character assets.

See `website/docs/preservation-report.json` for per-file reuse evidence, and `website/docs/implementation.md` for the adaptation and verification record.
