# Agent Instructions — Canvas Course Repo

This repository manages a Canvas LMS course as source files. Your job is to
create and edit course content *as files in this repo*, then build an
importable package — not to output one-off HTML in chat.

## Ground rules

1. **Read [SKILL.md](SKILL.md) before generating any HTML.** Every page and
   assignment body must follow it: inline `style=""` only, Canvas-safe
   elements only, no `<style>`/`<script>`/SVG/classes. Its element library
   (L/C/T/D/V/N/X/E series) is the building-block vocabulary.
2. **Read [style.md](style.md) and apply it to everything.** It defines this
   course's theme, colors, fonts, and recurring page sections. Consistency
   across pages matters more than per-page creativity. If style.md still
   contains template placeholders, ask the instructor for their preferences
   before generating lots of content.
3. **Content lives as markdown files with front matter:**
   - `pages/<slug>.md` — front matter (`title`, optional `front_page`,
     `published`) + body = Canvas HTML fragment
   - `assignments/<slug>.md` — front matter (`title`, `points`,
     `grading_type`, `submission_types`, `due`, `group`, …) + body =
     assignment description HTML (start headings at `<h2>` — Canvas shows
     the title itself)
   - `rubrics/<slug>.md` — grading rubric: front matter (`title`, optional
     `scale`) + a `| Criterion | Points | Description |` table; attach to an
     assignment with `rubric: <slug>` in its front matter. Every file in
     `rubrics/` is created in Canvas on import, so no drafts there.
   - `groups.md` — grading scheme table; `modules.md` — module structure;
     `syllabus.md` — syllabus body; `course.md` — course metadata
   - Full front-matter key reference: [tools/README.md](tools/README.md)
4. **Filenames are link slugs.** Link between pages with
   `$WIKI_REFERENCE$/pages/<filename-without-md>`; the build rewrites these
   to import-safe identifiers.
5. **Build after content changes:**
   ```
   python3 tools/build_imscc.py . -o dist/course.imscc
   ```
   The build validates the package; fix any errors it reports. Tell the
   instructor the file is ready to import (Canvas → Settings → Import
   Course Content → Canvas Course Export Package). Never edit `.imscc`
   files directly.
6. **Dates:** interpret plain dates/times in the timezone set in
   `course.md`. `due: 2026-10-07` means end-of-day; `due: 2026-10-07 14:00`
   is a specific local time.
7. **Don't duplicate what Canvas shows.** Assignment bodies never repeat
   the title, points, or due date. See SKILL.md's CONTEXT RULE.
   **Placeholder assignments:** when scaffolding a semester before briefs
   are written, give each assignment complete front matter (title, due,
   points, group — those are final from day one) and a minimal body:
   an HTML comment `<!-- PLACEHOLDER -->` on its own line, then one
   muted `<p>` such as "Full brief coming — date, points, and weighting
   above are final." Don't invent brief content the instructor hasn't
   provided. When asked to fill in or list remaining briefs, find them by
   searching assignment files for `<!-- PLACEHOLDER -->`, and remove the
   marker when real content replaces it. Placeholders default to
   `published: true` so dates and points appear in students' calendars;
   use `published: false` only if the instructor asks.
8. The instructor may also edit files visually with the Canvas Designer
   (the desktop app, or `python3 tools/designer.py .` — a local block
   editor over these same files).
   Treat designer-authored pages exactly like agent-authored ones —
   same format, same rules. If a `styles.json` exists at the course root,
   it holds named custom styles (color roles, font stack, radius, header
   gradient) created in the designer; when generating or restyling content,
   use the style marked `default` there (it refines style.md's theme
   choice) rather than inventing colors.
9. **The Official Course Outline is `syllabus.md` and has a required
   format.** When asked to create or update the course outline / syllabus,
   follow [templates/outline/FORMAT.md](templates/outline/FORMAT.md) exactly
   and copy the boilerplate matching `level` in course.md
   (`templates/outline/boilerplate-undergrad.md` or `-grad.md`) **verbatim —
   never paraphrase institutional language**. It uses plain hierarchical
   text, not the style.md theme, and restyle passes must skip it. It is a
   different document from any designed front page in `pages/` (e.g. a
   `course-outline` page) — never merge the two.
10. **Canvas editor round-trips degrade designed pages — never save a
   repo-managed page from the Canvas Rich Content Editor.** The *import*
   path keeps everything SKILL.md lists, but opening a page in the editor
   and clicking Save (even with no changes) runs TinyMCE's schema +
   Canvas's server-side whitelist, which additionally (observed on a
   production instance, 2026-08):
   - **removes any `<a>` that contains block children** (`<div>`, `<p>`),
     unwrapping the children and discarding the anchor's padding, border,
     background, and href. For clickable blocks, put `<span style="display:
     block">` children inside the `<a>` instead of `<div>`s.
   - **strips `font-weight` and `text-transform`** from every inline style.
     Use `<strong>` for bold and write literal capitals for uppercase.
   Survived: display/grid/flex and their gaps, margin, padding, font-size,
   line-height, color, max-width, font-family, text-decoration, img sizing.
   Generate every page and assignment body **editor-safe** by these rules so
   a stray edit-and-save in Canvas can't wreck it — and make all edits here,
   then rebuild and re-import (or push with `tools/canvas_api_sync.py`).
11. If the instructor's Canvas instance allows API tokens,
   `tools/canvas_api_sync.py` can push individual files directly — but
   never ask for or handle the token value yourself; the instructor sets
   `CANVAS_API_TOKEN` in their own shell.
12. **Manual edits in Canvas will happen. Sync them back here *before* any
   rebuild/re-import or API push** — every import overwrites the Canvas
   syllabus and every repo-managed page with the repo version. Two ways in:
   - **Saved HTML (usual):** the instructor drops the page's HTML into
     `sourceDocs/canvas-html/` — either the fragment from the editor's
     `</>` raw-HTML view, or the browser's "Save Page As → HTML only" of
     the page — then run
     `python3 tools/canvas_html_sync.py sourceDocs/canvas-html/<file>.html`.
     It infers the target (`syllabus.html` → `syllabus.md`, page/assignment
     by slug or title; `--target` overrides), rewrites Canvas URLs back to
     `$WIKI_REFERENCE$`/`$CANVAS_OBJECT_REFERENCE$`/`$IMS-CC-FILEBASE$`
     tokens, strips what Canvas adds, and prints a wording diff, a link
     diff, and a markup-loss warning. Nothing is written without `--apply`.
     **Read the diff and carry the wording changes into the repo file by
     hand, preserving the repo's markup**; use `--apply` only when the
     markup report shows no loss (plain-text pages, the syllabus) or the
     repo file is still a placeholder.
   - **Full export (occasional):** Canvas → Settings → Export Course
     Content → `.imscc`, then `tools/extract_imscc.py` into a scratch
     folder and diff against the repo.
   Some things are **Canvas-owned and never authored here**: LTI tools
   (e.g. a library's course-reserves tool — link to it, never create a
   page for it), announcements, discussions, and anything else the repo
   has no file for. Imports never delete or touch those.
