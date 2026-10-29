# Project Archive

This repository contains a reusable source-preserving skill and its integration kit.

- For the portfolio work, use `.agents/skills/rhine-eidolon-preserve/SKILL.md`.
- Preserve vendored source bytes under the skill's `assets/upstream/`. Create an editable copy with the materializer and keep changes in that copy or explicit adapters.
- The latest user request prefers substantial original code and effects. Phase-1 research is historical evidence; its suggestions to rewrite or abbreviate the experience are not current requirements.
- Keep original attribution and per-component licenses. The website lives in `website/intro` (original Eidolon landing) and `website/archive` (original Rhine terminal); their framework and style boundaries are intentional.
- Run `npm run verify` after changing integration resources and validate any affected reference build.
- Project metadata comes from `website/content/repositories.generated.json`; editorial descriptions, stable archive IDs and confirmed demos live in `projects.curated.json`. Never treat rounded GitHub `size: 0` as an empty-repository flag.
- For website changes run `npm run build:website`, `npm run test:website` and the affected browser flows. Use `npm run preview:website`; GitHub Pages base is `/project-archive/`.
