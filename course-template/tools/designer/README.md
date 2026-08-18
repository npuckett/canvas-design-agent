# Canvas Designer (v1)

A local visual page designer for a Canvas course repo. It is a second way to
create and edit the same files the AI-agent workflow uses — front matter +
Canvas-safe HTML in `pages/` and `assignments/` — so the two can be mixed
freely: generate a course with an agent and touch up pages visually, or build
pages visually and hand the repo to an agent for bulk changes.

No install, no dependencies:

```bash
python3 tools/designer.py .
```

Run it from your course folder (or pass the folder as the first argument). It
starts a local-only server on `http://127.0.0.1:8730` and opens your browser.

## What it does

- **Block editing** — every page is a stack of blocks. Click to select, type
  to edit text in place, drag or use ↑/↓ to reorder, duplicate, delete, or
  open any block's raw HTML.
- **Nested editing** — click *inside* a block to select a nested element
  (a column, a card body, a collapsible's content). The breadcrumb in the
  block toolbar shows where you are; palette inserts go **into** the
  selected container (placeholder text like "COLUMN 1" is cleared
  automatically) or **after** the selected element. Esc steps back out to
  the whole block. Inline elements and list/table internals are guarded so
  inserts always land somewhere structurally valid.
- **Course styles** — the ✎ Style button opens a style editor: start from
  any standard theme, adjust the nine color roles, font, corner radius, and
  header gradient, then save it as a named course style. Styles are stored
  in `styles.json` at the course root, appear in the theme dropdown under
  "Course styles", and can be marked as the course default (new/empty pages
  start in it). Because `styles.json` is machine-readable, agents can apply
  the same custom style — see the course template's CLAUDE.md.
- **Element palette** — the full SKILL.md element library (51 elements, 82
  variants) with live previews. Click to insert. What you insert is exactly
  the catalog HTML, so pages stay agent-compatible.
- **Themes** — switch any page between S01–S07 with one dropdown; every color,
  font stack, gradient, and border radius is remapped in place. The palette
  previews follow the active theme.
- **Canvas-safety check** — a deterministic lint of the rules the Canvas
  sanitizer enforces (no `<script>`/`<style>`/SVG, no `box-shadow`, no
  classes, no `data:` URIs, fragment-only, …). Blocks inserted from the
  palette are safe by construction; the check guards hand-edited HTML.
- **Assignment settings** — points, due date, group, grading type, submission
  type, published — a form over the same front matter `build_imscc.py` reads.
- **Build** — one button runs `tools/build_imscc.py` and produces
  `dist/<course>.imscc`, ready to import into Canvas (Settings → Import
  Course Content → Canvas Course Export Package).

## Files

- `designer.py` (one level up) — stdlib-only local server; file access is
  restricted to the course folder's content files.
- `catalog.js` — the element library, themes, and fonts extracted from
  SKILL.md into machine-readable form. **This is generated from SKILL.md**;
  if SKILL.md's element HTML or theme tables change, regenerate this file so
  the designer and the skill stay in sync.
- `index.html`, `app.js`, `style.css` — the editor UI.

## v1 limits / roadmap

- Theme switching maps the theme token colors; hand-picked spot colors in
  custom HTML are left alone (by design), and the V03 alert palette keeps its
  semantic status colors.
- Markdown import ("paste an outline, get blocks") is planned but not in v1 —
  create pages block-by-block or let an agent generate the first draft.
- `modules.md`, `groups.md`, and `course.md` are still edited as text.
- No image upload — reference Canvas-hosted or GitHub Pages URLs, as in the
  agent workflow.
- Packaged desktop app (signed macOS build) is a later milestone; v1 is the
  plain Python script.
