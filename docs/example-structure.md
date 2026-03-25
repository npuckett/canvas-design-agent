# Example Page Structure

This document explains the anatomy of the generated example HTML pages. Every example follows the same two-part structure: a **documentation wrapper** (the site page itself) and a **Canvas preview** (the actual HTML that gets pasted into Canvas). Understanding this separation is key to reading the examples and building your own.

## Page Layout Overview

Each example HTML file has these sections in order:

```
1. CSS Custom Properties   (:root variables)
2. Site Styles             (nav, hero, layout, responsive)
3. Site Navigation         (.site-nav)
4. Hero Banner             (.hero)
5. About This Example      (description + elements-used tag grid + callout)
6. Canvas Preview          (.canvas-preview wrapper)
   └── Canvas-safe HTML    (inline styles only -- this is what you paste)
7. Site Footer             (.site-footer)
```

Sections 1--5 and 7 are the **documentation wrapper**. They exist only on the reference website. Section 6 contains the actual Canvas-compatible HTML with inline styles.

## The Two Style Systems

### Documentation wrapper (sections 1--5, 7)

Uses CSS custom properties, class-based styles, and responsive breakpoints. This is standard modern CSS that would not work inside Canvas. It provides the black/greyscale site shell, navigation, hero banner, and explanatory content.

Key CSS custom properties shared across all examples:

| Variable | Value | Purpose |
|----------|-------|---------|
| `--color-bg` | `#fff` | Page background |
| `--color-text` | `#333` | Body text |
| `--color-text-muted` | `#495057` | Secondary text |
| `--color-heading` | `#000` | Headings |
| `--color-border` | `#dee2e6` | Borders and dividers |
| `--color-surface` | `#f8f8f8` | Card and section backgrounds |
| `--color-nav-bg` | `#000` | Navigation bar |
| `--color-hero-bg` | `#111` | Hero banner |
| `--container-max` | `860px` | Content max-width |

### Canvas preview (section 6)

Uses **only inline `style=""` attributes** on every element. No classes, no CSS variables, no `<style>` blocks. This is the HTML that survives Canvas RCE's sanitizer. When reading an example, everything inside `.canvas-preview-body` is the actual output.

## Section-by-Section Breakdown

### 1. CSS Custom Properties

```html
<style>
  :root {
    --color-bg: #fff;
    --color-text: #333;
    ...
  }
</style>
```

Defines the design tokens for the wrapper. All four examples use the same set of variables, keeping the documentation site visually consistent.

### 2. Site Styles

Class-based CSS for the navigation bar, hero, layout containers, headings, tag grid, callout boxes, Canvas preview frame, footer, and responsive breakpoints. These styles are identical across all example pages.

### 3. Site Navigation (`.site-nav`)

```html
<nav class="site-nav">
  <span class="site-nav__brand">Canvas Design Agent</span>
  <button class="site-nav__toggle" ...>&#9776;</button>
  <div class="site-nav__links">
    <a href="index.html">Home</a>
    <a href="elements.html">Elements</a>
    <a href="examples.html">Examples</a>
    <a href="guide.html">Guide</a>
    <a href="about.html">About</a>
    <a href="https://github.com/npuckett/canvas-design-agent">GitHub</a>
  </div>
</nav>
```

Sticky top navigation with a hamburger toggle for mobile. Same on every page.

### 4. Hero Banner (`.hero`)

```html
<header class="hero">
  <h1 class="hero__title">Example: [Page Name]</h1>
  <p class="hero__subtitle">One-line description of the example.</p>
</header>
```

Dark background, centered title. The title and subtitle change per example.

### 5. About This Example

This section contains three parts:

**Description** -- A paragraph explaining what type of Canvas page the example demonstrates.

**Elements Used (tag grid)** -- A visual list of every element ID used in the Canvas preview, displayed as rounded pills:

```html
<ul class="tag-grid">
  <li><span class="tag-id">V05</span> Gradient Header</li>
  <li><span class="tag-id">D05</span> Schedule Grid</li>
  ...
</ul>
```

**Callout** -- A "How to replicate" box telling the reader what to say to the agent to reproduce this style of page.

### 6. Canvas Preview (`.canvas-preview`)

This is the core of each example. It has two sub-parts:

**Label bar** -- A grey bar at the top that reads "Canvas Preview" (inserted via CSS `::before`). This visually frames the preview.

**Preview body** -- The actual Canvas-safe HTML, wrapped in `.canvas-preview-body`. Everything inside this div uses only inline styles and Canvas-compatible elements. This is exactly what you would copy into Canvas RCE.

```html
<div class="canvas-preview">
  <div class="canvas-preview-label"></div>
  <div class="canvas-preview-body">
    <!-- All Canvas-safe HTML goes here -->
    <!-- Uses ONLY inline style="" attributes -->
    <!-- References element IDs in HTML comments: <!-- V05: Gradient Header --> -->
  </div>
</div>
```

Inside the preview body, HTML comments mark which element from the catalog is being used (e.g., `<!-- V05: Gradient Header -->`, `<!-- D05: Schedule Grid -->`). These comments help you trace each section back to the Element Catalog.

### 7. Site Footer (`.site-footer`)

```html
<footer class="site-footer">
  Canvas Design Agent -- Example: [Page Name]
</footer>
```

## How the Four Examples Differ

Each example demonstrates a different type of Canvas page with a different mix of elements:

### Class Page (`example-class-page.html`)

A reusable single-class/lecture page. Color-coded header identifies the class type (blue for lecture). Includes agenda, content sections with key concepts, an in-class activity card, and collapsible resource sections.

**Key structural pattern:** Linear flow -- header, quick info row, reminder alert, agenda, content, activity, collapsible resources. Designed to be duplicated and edited each week.

**Elements:** V02, L03, C06, V01, T06, C01, C03, T02, N02, V03, T01, C07

### Course Timeline (`example-course-timeline.html`)

A 14-week semester schedule with anchor navigation and grading breakdown. Uses schedule grid tables with merged week cells, highlighted due dates, and a progress bar.

**Key structural pattern:** Header with TOC anchor links, progress bar, unit-grouped schedule tables, collapsible grading section with progress bar sub-components.

**Elements:** V05, D05, V01, V03, D07, N01, T01, T02, C01

### Project Brief (`example-project-brief.html`)

A detailed project assignment page with milestones, deliverables, and evaluation rubric. Uses CSS Grid for a sidebar/main layout, flexbox cards for deliverables, and a dark-theme submission section.

**Key structural pattern:** Gradient header, two-column grid (quick facts sidebar + description), milestone table, flexbox deliverable cards with status badges, progress bar grading weights, collapsible detailed rubric with styled definition list, dark submission section with action buttons.

**Elements:** V05, L04, L03, D01, D07, C01, C03, C04, V01, V03, V04, T01, T02, N02

### External Media Gallery (`example-external-media.html`)

Demonstrates GitHub Pages-hosted images, linked thumbnails, and an embedded p5.js sketch. All media URLs are absolute (Canvas has no file system).

**Key structural pattern:** Embedded iframe banner (cropped to 200px), gradient header, flexbox image grid with linked thumbnails, standalone GIF, full-height iframe embed, collapsible explainer sections.

**Elements:** E01, E02, E03, V05, L03, C01, T01

## CSS Comment Conventions

Inside the Canvas preview body, HTML comments follow this pattern:

```html
<!-- ELEMENT_ID: Description -->
```

Examples:
- `<!-- V05: Gradient Header -->`
- `<!-- D05: Schedule Grid Unit 1 -->`
- `<!-- L05: Centered Container -->`
- `<!-- C01: Resources Collapsible -->`
- `<!-- E02: Embedded p5.js sketch as banner -->`

These comments are stripped by Canvas RCE and exist only for documentation.

## Responsive Behavior

The documentation wrapper includes a responsive breakpoint at 640px that:

- Reveals the hamburger menu toggle
- Stacks the navigation links vertically
- Reduces container padding
- Adjusts section padding with `clamp()`

The Canvas preview content inside `.canvas-preview-body` uses its own responsive patterns (flexbox `flex-wrap`, `min-width` on flex children) that work independently within Canvas.

## Creating a New Example

To add a new example page:

1. Copy any existing `example-*.html` as a starting template.
2. Update the `<title>`, hero title/subtitle, and footer text.
3. Replace the "About This Example" description, tag grid, and callout.
4. Replace everything inside `.canvas-preview-body` with your Canvas-safe HTML.
5. Mark each element with an HTML comment (`<!-- ID: Name -->`).
6. Add a card to `examples.html` linking to the new page.
7. Create a matching prompt file in `docs/prompts/` showing the markdown input.
