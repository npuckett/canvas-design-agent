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
tools/               build/extract/sync scripts (no dependencies, Python 3.9+)
```

## The workflow

This repo is designed to be driven by an **AI coding agent** (Claude Code,
Cursor, VS Code + Copilot, etc.) opened in this folder. The agent reads
`CLAUDE.md` and `SKILL.md` automatically and knows the rules. You work in
plain language:

> "Create class pages for weeks 1–6 from my notes in notes.txt, using our
> course style."
>
> "Add a Project 2 assignment: 100 points, letter grade, PDF upload, due
> Oct 30. Weight it under the Projects group."
>
> "Shift every due date after reading week one week later, then rebuild."

Then get it into Canvas:

```
python3 tools/build_imscc.py . -o dist/course.imscc
```

Canvas → **Settings → Import Course Content → Canvas Course Export
Package** → pick the file → All Content. Re-importing after edits updates
existing content instead of duplicating it.

No AI tools? Everything is editable by hand — each file documents its own
format, and [tools/README.md](tools/README.md) is the full reference.

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

- [Workflows](https://npuckett.github.io/canvas-design-agent/docs/workflows.html) — all the ways to get content into Canvas
- [Element Catalog](https://npuckett.github.io/canvas-design-agent/docs/elements.html) — the Canvas-safe building blocks
- [tools/README.md](tools/README.md) — full front-matter and format reference
