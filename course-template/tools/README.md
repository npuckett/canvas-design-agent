# Canvas Course Tools

Command-line tools that remove the copy/paste step from the Canvas Design Agent
workflow. Instead of pasting HTML into the Rich Content Editor one page at a
time, you keep a whole course as a folder of markdown files and push it into
Canvas in bulk — assignments (with points, due dates, submission types, and
grading), assignment groups with grade weights, wiki pages, modules, and the
syllabus.

All tools are single-file Python scripts with **no dependencies** — any
Python 3.9+ works (`python3` on macOS, `py -3` on Windows).

> **Prefer editing visually?** The [Canvas Designer](designer/README.md) is
> a visual block editor over the same files — the full element library as an
> insertable palette, themes and custom course styles, assignment-settings
> forms, and a one-click package build. No AI tool required. Get it as a
> [signed Mac app](https://github.com/npuckett/canvas-design-agent/releases/latest)
> or run the zero-install script from any course folder:
> `python3 tools/designer.py .`

> **Faculty-friendly version:** the [Workflows page](https://npuckett.github.io/canvas-design-agent/docs/workflows.html)
> on the docs site covers the same three methods with step-by-step
> instructions and a decision guide. This file is the full technical
> reference.
>
> **Starting a new course?** Use the
> [canvas-course-template](https://github.com/npuckett/canvas-course-template)
> repository ("Use this template" on GitHub) instead of assembling a folder
> by hand — it bundles these tools, the skill file, and AI agent
> instructions. Its source of truth is [course-template/](../course-template/)
> in this repo; if you change the scripts here, re-copy them there and push
> to the template repo.

| Tool | What it does |
|---|---|
| `build_imscc.py` | Builds a Canvas-importable `.imscc` course package from a course folder |
| `extract_imscc.py` | Converts an existing Canvas course export into an editable course folder |
| `canvas_api_sync.py` | Pushes pages/assignments directly into Canvas via the REST API (no import step) |
| `canvas_html_sync.py` | Pulls manual Canvas edits back into the folder from a page's saved HTML (diff + optional apply) |
| `designer.py` | Opens the [Canvas Designer](designer/README.md) — a local visual block editor over the course folder |

## Getting HTML into Canvas: the three methods

### 1. Copy/paste into the RCE (the original workflow)

Generate a page with `SKILL.md`, copy the HTML source, paste it into the
Canvas HTML editor. Zero setup and works everywhere — but it's one page at a
time, and there is no way to set assignment metadata (points, due dates,
groups) from HTML at all. Best for: single pages, quick edits, workshop
settings.

### 2. Course package import (`build_imscc.py`) — best for bulk

Build a `.imscc` file and import it once: **Canvas → Settings → Import Course
Content → "Canvas Course Export Package" → choose file → All Content**. One
import creates *everything*: every page, every assignment with its points /
due date / submission type / grading type, assignment groups with percentage
weights and drop rules, module structure, the syllabus, and the course front
page.

- **No credentials or institutional approval needed** — if you can click
  "Import Course Content" you can use it.
- **Bulk updates**: identifiers are stable across rebuilds, so editing your
  markdown and re-importing **updates content in place** instead of
  duplicating it.
- **Selective import**: choose "Select specific content" during import to
  bring in only some items.
- The import itself is the one remaining manual action (two clicks), and
  Canvas queues large imports for a minute or two.

### 3. Direct REST API sync (`canvas_api_sync.py`) — fully hands-off

True zero-click updates: the script writes pages and assignments straight
into the course. Best for the edit loop *after* an initial bulk import —
change one file, run one command, refresh the browser.

- Requires a Canvas **access token** (Canvas → Account → Settings → Approved
  Integrations → New Access Token). Many institutions disable self-service
  tokens — if there is no "+ New Access Token" button below the Approved
  Integrations table on your settings page, yours is one of them: ask IT for
  a token, or use method 2 (which needs no credentials and covers more).
- Creates and updates pages, assignments, and the syllabus. Does **not**
  create assignment groups, weights, or modules — do the initial course
  structure with method 2, then use this for content updates.
- Treat the token like a password. Test on a sandbox course first.

**Recommended combination**: build the course structure once with
`build_imscc.py` + import, then push day-to-day content edits with
`canvas_api_sync.py` (or just re-import — both work from the same folder).

## Quick start

```bash
# Build the bundled example course into an importable package
python3 tools/build_imscc.py tools/example-course

# Start a new course folder from your existing Canvas course:
# (Canvas -> Settings -> Export Course Content -> download the .imscc)
python3 tools/extract_imscc.py my-course-export.imscc -o my-course
python3 tools/build_imscc.py my-course

# Push edits straight into Canvas over the API
export CANVAS_API_TOKEN="1234~..."
python3 tools/canvas_api_sync.py my-course \
    --base-url https://canvas.youruniversity.edu --course-id 12214
```

## Course folder format

```
my-course/
├── course.md          course title, code, timezone (required)
├── groups.md          assignment groups + grade weights (markdown table)
├── syllabus.md        syllabus HTML fragment
├── modules.md         module structure
├── assignments/       one .md file per assignment
│   └── project-1.md
├── pages/             one .md file per wiki page
│   └── class-1.md
├── rubrics/           one .md file per grading rubric
│   └── project-rubric.md
└── web_resources/     files shipped inside the package (images, PDFs)
```

Every `.md` file is **front matter (settings) + body (Canvas HTML
fragment)**. The body is normal Canvas Design Agent output — inline styles
only, built from the SKILL.md element library. An AI agent working in this
repo can generate the whole folder from your course notes; see "Scaling Up"
in [SKILL.md](../.github/SKILL.md).

### course.md

```markdown
---
title: DIGF-1234-001 (Fall 2026) Example Studio Course
course_code: DIGF-1234-001
timezone: America/Toronto
---
```

`timezone` is an IANA name (`America/Toronto`, `America/New_York`, `UTC`).
All assignment dates are interpreted in this timezone.

### groups.md — assignment groups and grading weights

```markdown
| Group | Weight | Drop Lowest |
|---|---|---|
| In-Class Exercises | 30 | 2 |
| Project 1 | 30 | |
| Final Project | 40 | |
```

Weights are percentages of the final grade. "Drop Lowest" tells Canvas to
drop that many lowest scores from the group. Assignments referencing a group
not listed here get an unweighted group created automatically.

### assignments/*.md

```markdown
---
title: Project 1 - Proposal
group: Project 1
points: 100
grading_type: letter_grade
submission_types: online_upload,online_url
allowed_extensions: pdf
due: 2026-10-07 23:59
---

<h2>About</h2>
<p>Assignment description as a Canvas HTML fragment...</p>
```

| Key | Values | Default |
|---|---|---|
| `title` | any text | filename |
| `points` | number | 100 |
| `grading_type` | `points`, `percent`, `letter_grade`, `gpa_scale`, `pass_fail`, `not_graded` | `points` |
| `submission_types` | comma list: `online_upload`, `online_url`, `online_text_entry`, `media_recording`, `student_annotation`, `on_paper`, `none` | `online_upload` |
| `allowed_extensions` | comma list, e.g. `pdf,zip` | any |
| `due` / `unlock` / `lock` | `2026-10-07` (all-day, 11:59 PM), `2026-10-07 14:00` (local time), or `2026-10-08T03:59:59Z` (UTC) | none |
| `group` | assignment group title from groups.md | none |
| `group_category` | student group set name — makes it a **group assignment** | none |
| `published` | `true` / `false` | `true` |
| `peer_reviews` / `peer_review_count` | `true` / number | off |
| `omit_from_final_grade` | `true` / `false` | `false` |
| `position` | number (order in the group) | file order |
| `rubric` | rubric filename slug or title from `rubrics/` | none |
| `rubric_use_for_grading` | `true` / `false` — rubric score fills the grade | `true` |
| `rubric_hide_points` / `rubric_hide_score_total` | `true` / `false` | `false` |

Assignment descriptions should start at `<h2>` — Canvas already shows the
assignment name, points, and due date above the description.

### rubrics/*.md — grading rubrics

Canvas's rubric editor is one of its clunkiest screens; here a rubric is one
markdown file — front matter + a criteria table — attached to an assignment
with a single `rubric:` front-matter key:

```markdown
---
title: Project Rubric
scale: Excellent 100, Good 85, Needs Work 70, Below 55, No Evidence 0
---

| Criterion | Points | Description |
|---|---|---|
| Concept | 30 | Clarity and depth of the idea |
| Craft | 40 | Quality of execution and attention to detail |
| Documentation | 30 | Completeness and polish of the writeup |
```

```markdown
# assignments/project-1.md front matter
rubric: project-rubric        # filename slug (or the rubric's title)
```

Every criterion gets the rating ladder from `scale` — each entry is
`Label percent`, applied to the criterion's points (Craft above rates
40 / 34 / 28 / 22 / 0). Omit `scale` for the default
`Excellent 100, Good 75, Needs Work 50, Below 25, No Evidence 0`.

When one shared ladder isn't enough, spell out exact points by adding one
column per rating — column headers are the rating labels:

```markdown
| Criterion | Points | Description | Excellent | Good | Poor |
|---|---|---|---|---|---|
| Concept | 30 | Clarity and depth | 30 | 24 | 0 |
| Craft | 40 | Quality of execution | 40 | 30 | 0 |
```

Front matter keys (all optional):

| Key | Values | Default |
|---|---|---|
| `title` | rubric name shown in Canvas | filename |
| `scale` | `Label percent` list, ignored when the table has rating columns | `Excellent 100, Good 75, Needs Work 50, Below 25, No Evidence 0` |
| `free_form_comments` | `true` — graders write a comment per criterion instead of clicking a rating | `false` |
| `use_range` | `false` — ratings are exact values instead of ranges | `true` |
| `hide_score_total` | `true` / `false` | `false` |

Details worth knowing:

- The rubric's total points is the sum of the criterion points. If an
  assignment uses the rubric **for grading** (the default), the build warns
  when the totals don't match the assignment's `points`.
- Rating points must descend left-to-right; the build errors otherwise.
- **Every file in `rubrics/` is created in Canvas on import**, whether or
  not an assignment references it — don't keep drafts in the folder.
- Descriptions are plain text (inline HTML allowed). Write a literal `|`
  inside a cell as `&#124;` so it doesn't split the table.
- Partial builds (`--only`) always include all rubrics, like assignment
  groups, so attachments stay in sync.
- `extract_imscc.py` round-trips rubrics into this format (using explicit
  rating columns so points survive exactly). One nuance: Canvas allows each
  criterion to have differently-named rating labels; this format shares one
  label set per rubric, taken from the first criterion.

### pages/*.md

```markdown
---
title: Class 1 - Introduction
front_page: true        # optional: make this the course home page (one page only)
published: true
---

<div>...Canvas HTML fragment...</div>
```

The filename becomes the page's link slug: link between pages with
`$WIKI_REFERENCE$/pages/<filename-without-md>`. The builder rewrites these
to Canvas migration identifiers so links survive import; `canvas_api_sync.py`
rewrites them to real `/courses/:id/...` paths.

### modules.md

```markdown
# Week 1 - Getting Started
- header: Wednesday
- page: class-1-introduction
- assignment: exercise-1-hello-canvas
- url: https://p5js.org/ | p5.js Reference

# Week 2
- page: class-2
```

Each `#` heading is a module; items reference pages and assignments by their
filename slug. `header:` adds a text divider, `url:` an external link.

## Keeping a live course in sync during the semester

Once a course is managed from a source folder, you never need to re-export
from Canvas. The folder is the source of truth and sync is one-directional:
edit or add files → rebuild → import. Because identifiers are stable,
imports **update matching content in place** and simply add anything new.

Three levels of granularity, all ending at the same Import button:

- **Full rebuild** (the default): `python3 tools/build_imscc.py my-course`
  and import All Content. Unchanged items are re-imported identically, so
  this is always safe — it just touches everything.
- **Partial package** with `--only`: ship exactly the items you changed or
  added this week:

  ```bash
  python3 tools/build_imscc.py my-course \
      --only pages/class-7.md --only assignments/project-2.md
  ```

  The package contains just those items (plus assignment groups, so grade
  weights stay in sync). Links to pages *not* in the package still resolve,
  because they reference stable migration ids from earlier imports. Modules
  and `web_resources/` are only written on full builds.
- **Canvas-side selection**: import a full package but choose "Select
  specific content" instead of "All Content" during import, then tick just
  the items you want. Same result as `--only`, no extra build.

Two things imports **don't** do:

- **Deletes.** Removing a file from the folder doesn't remove the item from
  Canvas — delete it in Canvas by hand.
- **Merging.** If you hand-edit an item inside Canvas, the next import that
  includes that item overwrites the Canvas version. Keep edits in the
  folder, or use `--only` to keep re-imports away from items you've touched
  in Canvas.

## Bulk-update workflow for an existing course

Use this when a course exists **only in Canvas** and you want to start
managing it from a folder (the one-time bootstrap — not needed once the
folder exists):

1. **Export** the course: Canvas → Settings → Export Course Content →
   "Course" → download the `.imscc`.
2. **Extract** it: `python3 tools/extract_imscc.py export.imscc -o my-course`
3. **Edit** the markdown files — by hand, or by pointing an AI agent with
   SKILL.md at the folder ("restyle every class page with the Studio Dark
   theme", "add a rubric section to all Workshop assignments", "shift all
   due dates one week later").
4. **Rebuild**: `python3 tools/build_imscc.py my-course`
5. **Import** back into Canvas (or a fresh course shell for next semester).

Note: the first import of a rebuilt package creates content alongside the
originals (identifiers change during extraction), so this round trip is best
for populating a *new* course shell — e.g. next semester's section. For
updating a live course in place, either re-import the *same* source folder
after edits (rebuilds keep identifiers stable) or use `canvas_api_sync.py`.

## Pulling manual Canvas edits back (`canvas_html_sync.py`)

Someone will eventually edit a page in Canvas directly. Because every
import (and every API push) overwrites Canvas with the folder's version,
those edits must come back into the folder first. You don't need a full
export for that:

1. In Canvas open the page (or Syllabus → Edit) and either switch the
   editor to its `</>` raw-HTML view and copy everything into
   `sourceDocs/canvas-html/<name>.html`, **or** use the browser's
   File → Save Page As → "Webpage, HTML Only" on the normal page view.
   Both forms work; the tool finds Canvas's content container itself.
2. Run it:

   ```bash
   python3 tools/canvas_html_sync.py sourceDocs/canvas-html/syllabus.html
   ```

   It infers the target file from the name (`syllabus` → `syllabus.md`,
   otherwise a page/assignment matched by slug, title, or `<h1>`; use
   `--target pages/home.md` to force it), rewrites Canvas URLs back into
   `$WIKI_REFERENCE$` / `$CANVAS_OBJECT_REFERENCE$` / `$IMS-CC-FILEBASE$`
   tokens (numeric assignment and file ids are resolved by link text,
   `title`/`alt`, and the links already in the repo file), strips the
   `data-api-*`/`class` attributes and link icons Canvas adds, and prints:
   - a **text diff** with tags stripped — the actual wording changes,
   - a **link diff** — links added or removed,
   - a **markup report** — style/`<strong>`/anchor counts, with a warning
     if the Canvas copy lost markup (the editor strips `font-weight`,
     `text-transform`, and block-level anchors on save).
   For an **assignment** saved as a full page it also lists the points, due
   date, and submission type shown on that page next to the front matter
   values — those live in front matter, not the HTML, so update them there
   if Canvas differs.
3. Carry the wording changes into the repo file by hand (keeps the repo's
   markup), or, when the markup report shows no loss — or the repo file is
   still a `<!-- PLACEHOLDER -->` — take the Canvas body wholesale with
   `--apply` (front matter is kept). `--out FILE` saves the
   cleaned body for a manual merge; `--raw` adds a raw HTML diff.
4. Rebuild and re-import (or push) so Canvas carries the clean version.

Without `--apply` the tool changes nothing, so it doubles as a drift check.

## Verifying an import

After importing, spot-check in Canvas:

- **Assignments** → groups, weights (Assignments → ⋮ → Assignment Groups
  Weight), points, due dates
- **Rubrics** → open an assignment that has one attached; criteria, ratings,
  and totals should match your `rubrics/*.md`
- **Pages** → formatting survived (Canvas re-sanitizes HTML on import, same
  rules as the RCE — SKILL.md-generated HTML passes cleanly)
- **Modules** → structure and item order
- Internal links between pages resolve

## Limitations

- Discussions, quizzes, announcements, and files-tab organization are not
  generated (extract keeps none of them either). Add those in Canvas
  directly, or extend the tools.
- Rubrics travel through the `.imscc` path only — `canvas_api_sync.py`
  doesn't create or attach them, so push rubric changes via build + import.
- `canvas_api_sync.py` matches assignments by exact title — renaming an
  assignment in the front matter creates a new one via the API path (the
  .imscc path is immune: it matches on stable identifiers).
- Canvas sanitizes imported HTML exactly like pasted HTML: stick to the
  SKILL.md element library.
