---
title: COURSE-CODE-SECTION (Term Year) Course Title
course_code: COURSE-CODE
timezone: America/Toronto
level: undergrad
---

Edit the front matter above:

- `title` — how the course appears in Canvas (e.g. `DIGF-2014-301 (Fall 2026) Atelier I`)
- `course_code` — the short code (also used to generate stable content IDs;
  don't change it after your first import, or a re-import will duplicate
  content instead of updating it)
- `timezone` — IANA name; all assignment due dates are interpreted in this
  timezone (`America/Toronto`, `America/New_York`, `America/Vancouver`, `UTC`, …)
- `level` — `undergrad` or `grad`; selects which institutional boilerplate
  the Official Course Outline (`syllabus.md`) uses, see
  [templates/outline/FORMAT.md](templates/outline/FORMAT.md). Ignored by the
  build itself.

This body text is ignored by the build.
