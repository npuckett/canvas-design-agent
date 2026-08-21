# Official Course Outline — Format Spec

The Course Outline is the institutionally formatted document OCAD U shows on
the Canvas **Syllabus** tab. It is generated into `syllabus.md` (the whole
body of that file *is* the outline). It follows this spec exactly — it does
**not** use the course theme from `style.md`, and restyle passes must never
touch it. Its look is deliberately plain, hierarchical text, matching the
output of OCAD's outline system.

**This is not the course's front page.** A course may also have a designed,
theme-styled overview page in `pages/` (often named `course-outline`) that
serves as the Canvas front page. That page is free-form course content; this
document is the institutional record with a required format. Never merge the
two, and never apply this spec to the front page or vice versa.

## Which boilerplate file to use

`course.md` front matter carries `level: undergrad` or `level: grad`. Use the
matching file in this folder:

- `boilerplate-undergrad.md`
- `boilerplate-grad.md`

Boilerplate blocks are institutional language. Copy them **verbatim — never
paraphrase, reflow, summarize, or "improve" them.** If `level` is missing,
ask the instructor rather than guessing.

## Markup rules

- Everything inside the standard syllabus wrapper:
  `<div style="max-width: 800px; margin: 0 auto; padding: 24px; font-family: system-ui, -apple-system, sans-serif;">`
- Section headings: `<h2 style="margin-top: 24px;">Section Name</h2>` — no
  colors, borders, or banners.
- Subsections: `<h3 style="margin-top: 16px;">…</h3>`.
- Body text: plain `<p>` / `<ul>` with no styling.
- Tables: plain and minimal —
  `<table style="width: 100%; border-collapse: collapse;">` with
  `<th>`/`<td>` styled `padding: 8px 12px; border: 1px solid #cccccc; text-align: left; vertical-align: top;`
  and no background colors. Exception: the course-information table at the
  top has **no borders** — `<th>` styled
  `padding-right: 1.5rem; text-align: left; vertical-align: top;` with
  `scope="row"`, plain `<td>`.
- External links: `target="_blank" rel="noopener"`. In-course links use
  `$CANVAS_COURSE_REFERENCE$` / `$WIKI_REFERENCE$` per SKILL.md.
- Inline styles only, Canvas-safe elements only (SKILL.md still applies);
  entities (`&ndash;`, `&mdash;`) for typographic characters.

## Section order

Fixed. Every section appears, in this order. The instructor may additionally
insert course-specific sections (e.g. Overview, Course Topics &amp;
Objectives) between #5 and #6 using the same plain markup — preserve them
when regenerating; never remove or restyle them. Tags: **[BOILERPLATE]** = copy
verbatim from the level's boilerplate file; **[INSTRUCTOR]** = the
instructor's standing text (in the boilerplate file, but the instructor may
override per course); **[COURSE]** = generated from this course's data
(courseData.md or equivalent — never invented).

1. **Course information table** [COURSE] — no heading; rows in order:
   Delivery Method, Term, Credit Value, Meeting Times, Course Dates,
   Instructors, Office Hours. Values come from the registrar/course record.
2. **Description** [COURSE] — the official calendar description, verbatim.
3. **Learning Outcomes** [COURSE] — fixed stem line
   `<p>By the end of this course, students will be able to:</p>` followed by
   the approved outcomes as a `<ul>`. If outcomes are not on file, use the
   placeholder convention (`<!-- PLACEHOLDER -->` + one muted `<p>`) and tell
   the instructor.
4. **Supplies** [COURSE] — software/materials with approximate costs and
   free alternatives where they exist.
5. **Student Preparation / Workload Expectations** [BOILERPLATE]
6. **Class Schedule** — boilerplate intro paragraph [BOILERPLATE], then one
   `<h3>` per class meeting [COURSE], format `Month D: Topic`, in date order.
   Online sessions append ` (Online)`. No-class days appear as
   `Month D: No class &mdash; Reason`. If work is due that day, follow the
   `<h3>` with `<p>Due: Assignment Name</p>`. Assessment-period deadlines
   after the last class get an `<h3>` like `Month D: Assessment period` with
   their `Due:` line.
7. **Assignments, Critiques and Exams** [COURSE] — plain table (see markup
   rules): columns `Assignment | Due (11:59 PM) | Weight`. Weights must
   total 100%. If none exist yet, `<p><em>No assignments.</em></p>`.
8. **Academic Engagement** [COURSE] — instructor-authored expectations for
   participation in this course.
9. **Late Work** [INSTRUCTOR]
10. **Grading Breakdown** [BOILERPLATE] — the letter-grade scale. This is
    the section that differs most between undergrad and grad.
11. **Academic Integrity** [BOILERPLATE] — includes the
    `Academic Integrity and Generative Artificial Intelligence (GAI)` `<h3>`.
12. **Student Feedback on Courses** [BOILERPLATE]
13. **University Policies** [BOILERPLATE] — contains the
    `$CANVAS_COURSE_REFERENCE$/external_tools/466` Policies & Resources link.
14. **Commitment to Sustainability** [BOILERPLATE]
15. **Bibliography and/or Recommended Texts** — boilerplate intro sentence
    [BOILERPLATE], then the course's entries [COURSE] as a `<ul>` (omit the
    list entirely if there are none; the intro still appears).
16. **Production Materials Fees and Laptop Fees** [BOILERPLATE]
17. **Disclaimer Statement** [BOILERPLATE]

## Dates

Written as `Month D` (e.g. `September 10`) within the schedule, and
`Month D&ndash;Month D, YYYY` for ranges. Weekday-first (`Tuesday
September 29`) in the assignments table, matching style.md's convention.
