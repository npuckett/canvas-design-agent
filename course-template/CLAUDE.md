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
8. The instructor may also edit files visually with
   `python3 tools/designer.py .` (a local block editor over these same
   files). Treat designer-authored pages exactly like agent-authored ones —
   same format, same rules. If a `styles.json` exists at the course root,
   it holds named custom styles (color roles, font stack, radius, header
   gradient) created in the designer; when generating or restyling content,
   use the style marked `default` there (it refines style.md's theme
   choice) rather than inventing colors.
9. If the instructor's Canvas instance allows API tokens,
   `tools/canvas_api_sync.py` can push individual files directly — but
   never ask for or handle the token value yourself; the instructor sets
   `CANVAS_API_TOKEN` in their own shell.
