# Canvas Design Agent

A portable skill and reference system that transforms plain text into Canvas LMS-compatible HTML. Built for faculty with little or no HTML knowledge.

## What This Is

Canvas LMS strips most CSS (no `<style>` blocks, no external stylesheets, no JavaScript) and many HTML elements. Only inline `style=""` attributes and specific HTML elements survive the Rich Content Editor (RCE). This project provides:

1. **[SKILL.md](.github/SKILL.md)** -- An agent instruction file containing Canvas constraints, a numbered element library, and transformation rules. Works with any LLM.
2. **Reference Website** (in `docs/`) -- A visual catalog of every available element, step-by-step workflow instructions, and a methods guide for creating course-specific templates.

## Getting the Skill

**Option A: Clone / download the whole repo** (recommended if you want the reference site and examples too):

```
git clone https://github.com/npuckett/canvas-design-agent.git
```

Open the folder in VS Code (or your editor). The skill file lives at `.github/SKILL.md` and is automatically picked up by editors that read instruction files from that location (VS Code with Copilot, Cursor, Windsurf, etc.). You can start writing content files immediately.

**Option B: Download only the skill file:**

If you already have a project and just need the skill, download [SKILL.md](.github/SKILL.md) and place it in your project's `.github/` directory. That's the only file the agent needs.

## Quick Start

### Workflow A: Local Agent (VS Code with Copilot, Cursor, etc.)

1. Clone this repo (or copy [`.github/SKILL.md`](.github/SKILL.md) into your own project's `.github/` folder).
2. Open the project folder in your editor. The agent will automatically read the skill file.
3. Write your course content in a plain text or markdown file.
4. Ask the agent to transform your content into Canvas HTML, optionally referencing element numbers from the catalog (e.g., "use L03 for a flexbox layout" or "make the schedule a D01 data table").
5. Copy the generated HTML into Canvas RCE (switch to HTML editor view) and save.

### Workflow B: Web-Based Agent (ChatGPT, Claude, Gemini, etc.)

1. Upload [`.github/SKILL.md`](.github/SKILL.md) to the conversation (or paste its contents).
2. Upload or paste your plain text content.
3. Ask the agent to transform your content into Canvas HTML using the skill instructions.
4. Copy the generated HTML into Canvas RCE (switch to HTML editor view) and save.

## File Structure

```
canvas-design-agent/
  README.md                       -- This file
  .github/
    SKILL.md                      -- Portable agent skill (the core instruction set)
  docs/
    index.html                    -- Landing page: overview, workflows, methods guide
    elements.html                 -- Visual element catalog with numbered previews
    example-course-timeline.html  -- Example: 14-week course schedule
    example-class-page.html       -- Example: reusable class/lecture page
    example-project-brief.html    -- Example: project assignment brief
```

## Reference Website

Open `docs/index.html` in a browser to view the full reference site. It can also be hosted on GitHub Pages by configuring the repository to serve from the `docs/` folder.

The site includes:
- **Workflows** -- Step-by-step instructions for both local and web-based agent usage
- **Methods** -- How to create and maintain course-specific templates
- **Element Catalog** -- Visual preview of every Canvas-safe HTML element with its ID number
- **Examples** -- Three full page examples (course timeline, class page, project brief) showing realistic Canvas pages built from the element library

## Element Numbering System

Elements are organized by category with a letter prefix:

| Prefix | Category | Count |
|--------|----------|-------|
| L | Layout | 6 |
| C | Content Organization | 8 |
| T | Typography | 9 |
| D | Data Display | 7 |
| V | Visual Indicators | 6 |
| N | Navigation | 2 |
| X | Canvas Integration | 6 |

Faculty reference elements by number (e.g., "use C01 for collapsible sections"). The agent knows the corresponding HTML.

## Canvas Constraints (Summary)

**Works (inline style only):** flexbox, grid, gradients, relative/absolute positioning, overflow, max-width centering, details/summary, mark, abbr, definition lists, all table features, audio/video controls.

**Stripped:** `<style>` blocks, `<script>`, SVG, meter/progress, fieldset/legend, box-shadow, text-shadow, opacity, transform, letter-spacing, external CSS/JS, data URIs.

See [SKILL.md](.github/SKILL.md) for the complete constraint reference.
