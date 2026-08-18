# Course Repo Template

A starting point for managing a Canvas LMS course as a repository. Your
course lives here as plain text files — pages, assignments, grading scheme,
modules — and gets built into a package that Canvas imports in one step.
Edit the files (or have an AI coding agent edit them), rebuild, re-import:
Canvas updates in place.

This template is part of the [Canvas Design Agent](https://github.com/npuckett/canvas-design-agent)
project. It is self-contained: the skill file, the build tools, and starter
content are all here.

## Get your own copy

Pick one:

- **Use this template on GitHub** (recommended — gives you history and
  backup): on [github.com/npuckett/canvas-course-template](https://github.com/npuckett/canvas-course-template),
  click the green **"Use this template"** button → "Create a new
  repository", name it for your course (e.g. `digf-2014-fall-2026`), then
  clone your new repo to your computer.
- **Without a GitHub account** — [download the ZIP](https://github.com/npuckett/canvas-course-template/archive/refs/heads/main.zip)
  and rename the folder, or run:

  ```
  npx degit npuckett/canvas-course-template my-course
  ```

  Then optionally make it a local git repository for history:

  ```
  cd my-course
  git init && git add . && git commit -m "start course repo"
  ```

## What's inside

```
course.md            course title, code, timezone        ← edit first
style.md             your course's visual identity       ← edit second
groups.md            grading scheme (weights, drop rules)
modules.md           week-by-week module structure
syllabus.md          syllabus content
assignments/         one .md file per assignment (settings + HTML)
pages/               one .md file per page (settings + HTML)
web_resources/       images/files shipped into Canvas
SKILL.md             the Canvas HTML rules your AI agent follows
CLAUDE.md            instructions for AI coding agents working in this repo
tools/               build/extract/sync scripts + the visual Designer (no dependencies, Python 3.9+)
```

## Two ways to work on this repo

Both methods read and write the same files, so you can mix them freely.

**Visually — Canvas Designer.** A local block editor with the whole
Canvas-safe element library as an insertable palette, theme switching and
custom course styles, assignment-settings forms, and the package build
behind one button. No AI involved. Use the
[Mac app](https://github.com/npuckett/canvas-design-agent/releases/latest)
and open this folder, or run the included script:

```
python3 tools/designer.py .
```

**With an AI coding agent** (Claude Code, Cursor, VS Code + Copilot, etc.)
opened in this folder. The agent reads `CLAUDE.md` and `SKILL.md`
automatically and knows the rules. You work in plain language:

> "Create class pages for weeks 1–6 from my notes in notes.txt, using our
> course style."
>
> "Add a Project 2 assignment: 100 points, letter grade, PDF upload, due
> Oct 30. Weight it under the Projects group."
>
> "Shift every due date after reading week one week later, then rebuild."

Either way, get it into Canvas the same way:

```
python3 tools/build_imscc.py . -o dist/course.imscc
```

(Or click **Build** in the Designer.) Canvas → **Settings → Import Course
Content → Canvas Course Export Package** → pick the file → All Content.
Re-importing after edits updates existing content instead of duplicating it.

No AI tools and no Designer? Everything is still editable by hand — each
file documents its own format, and [tools/README.md](tools/README.md) is
the full reference.

## Customizing your course identity

`style.md` is what makes this *your* course repo rather than a generic one.
Set your theme, colors, fonts, and the sections every class page should
have. Agents apply it to everything they generate, so every page comes out
consistent — and restyling the whole course later is a one-line change plus
a rebuild.

## Starting from an existing Canvas course

Already have a course in Canvas? Export it (Settings → Export Course
Content), then:

```
python3 tools/extract_imscc.py your-export.imscc -o .
```

Your live course becomes editable files in this repo.

## Learn more

- [Canvas Designer](https://npuckett.github.io/canvas-design-agent/docs/designer.html) — the visual editor for this folder
- [Workflows](https://npuckett.github.io/canvas-design-agent/docs/workflows.html) — creating with Designer or AI, and all the ways to publish into Canvas
- [Element Catalog](https://npuckett.github.io/canvas-design-agent/docs/elements.html) — the Canvas-safe building blocks
- [tools/README.md](tools/README.md) — full front-matter and format reference
