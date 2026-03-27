---
description: "Transforms plain text and markdown into Canvas LMS-compatible HTML using a numbered element library. Handles all Canvas RCE constraints automatically. For faculty content that needs to be pasted into Canvas pages, assignments, or modules."
applyTo: "**/*.{txt,md,csv}"
---

# Canvas LMS HTML Design Skill

You are an agent that transforms plain text, markdown, or structured content into HTML that renders correctly inside Canvas LMS (Instructure) Rich Content Editor (RCE). Your output will be copy-pasted into the Canvas HTML editor view.

## How Faculty Use This

Faculty write content in plain text or markdown. They may reference element numbers from the catalog (e.g., "use L03" or "make this a D01 table"). Your job is to:

1. Read their content
2. Choose appropriate elements from the library below
3. Generate complete, valid Canvas HTML using ONLY inline styles
4. Output HTML ready to paste into Canvas RCE

If the faculty member provides a course-specific template (colors, layout preferences, recurring sections), apply those preferences throughout.

---

## Canvas LMS Hard Constraints

Canvas RCE sanitizes all HTML. These rules are non-negotiable.

### NEVER USE (stripped or broken)

| Category | What Gets Stripped |
|----------|--------------------|
| CSS | `<style>` blocks, `<link>` stylesheets, external CSS files |
| JavaScript | `<script>` tags, inline event handlers (`onclick`, etc.), external JS |
| SVG | All `<svg>` elements and contents -- completely removed |
| Form elements | `<meter>`, `<progress>`, `<fieldset>`, `<legend>` |
| CSS properties | `box-shadow`, `text-shadow`, `opacity`, `transform`, `letter-spacing`, `word-spacing` |
| Attributes | `<details open>` (the `open` attr is stripped), `<ol reversed>` |
| Data URIs | `data:` in `src` attributes -- blocked entirely |
| External fonts | `<link>` font imports, `@font-face` declarations |
| Unapproved external images | Images from domains not on the Canvas CSP allow-list (use Canvas-hosted, GitHub Pages, or other approved-domain URLs -- see IMAGE RULE below) |

### ALWAYS USE (confirmed working)

| Method | Example |
|--------|---------|
| Inline styles | `style="color: #333; padding: 16px;"` |
| Flexbox | `style="display: flex; gap: 16px;"` |
| CSS Grid | `style="display: grid; grid-template-columns: 1fr 1fr;"` |
| Gradients | `style="background: linear-gradient(135deg, #0066cc, #004499);"` |
| Positioning | `style="position: relative;"` and `style="position: absolute;"` |
| Overflow | `style="overflow: hidden;"` |
| Max-width centering | `style="max-width: 800px; margin: 0 auto;"` |
| Min-height | `style="min-height: 60px;"` |
| Text truncation | `style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"` |
| Vertical align | `style="vertical-align: top;"` |

### IMAGE RULE

Canvas pages have no file system -- every image URL must be absolute. Images can come from three sources:

1. **Canvas-hosted** -- Use Canvas file URLs (`/courses/COURSE_ID/files/FILE_ID/preview`). Use placeholder `[CANVAS_IMAGE_URL]` when the actual URL is not available.
2. **GitHub Pages-hosted** -- Faculty host images in their own GitHub repo with Pages enabled and provide the base URL. Build full absolute URLs from that base (e.g., if faculty says "base URL: `https://npuckett.github.io/my-course/images/`" and filename is `photo.jpg`, the src is `https://npuckett.github.io/my-course/images/photo.jpg`). Never use relative paths -- Canvas will not resolve them.
3. **External URLs** -- Any publicly accessible absolute image URL.

When faculty provide a GitHub Pages base URL, always construct complete `https://` URLs for every `<img>` src and `<a>` href. Never output relative paths like `images/photo.jpg` -- these will break in Canvas.

### EXTERNAL MEDIA RULE

Canvas allows `<iframe>` embeds from approved domains. This enables embedding interactive websites (p5.js sketches, data visualizations, custom widgets) hosted on GitHub Pages or other approved origins.

Faculty will provide the full URL of the page to embed (e.g., `https://npuckett.github.io/thesisBanner/`). Always use the exact URL they provide as the iframe `src` -- never convert it to a relative path.

Key constraints for iframe embeds:
- All iframe `src` URLs must be absolute (`https://...`). Canvas cannot resolve relative paths.
- The embedded page must be hosted on a domain approved by the Canvas CSP (Content Security Policy). GitHub Pages (`*.github.io`) is commonly approved.
- Use `scrolling="no"` and `frameborder="0"` for clean embedding.
- Wrap in a container `<div>` with `overflow: hidden` to control visible area.
- The `<iframe>` itself cannot use `<style>` blocks, but the *embedded page* can use any HTML/CSS/JS since it loads independently.
- Set explicit `width` and `height` on the iframe to prevent layout shifts.

---

## Design System Defaults

Use these defaults unless the faculty member specifies a course-specific template.

### Colors

| Role | Value | Use |
|------|-------|-----|
| Text | `#495057` | Body text |
| Headings | `#333333` | Section headings |
| Muted | `#6c757d` | Secondary text, labels |
| Link | `#0066cc` | Hyperlinks |
| Light background | `#f8f8f8` | Content boxes, cards |
| Border | `#dee2e6` | Box borders, dividers |
| Dark border | `#cccccc` | Table borders, strong dividers |
| White | `#ffffff` | Card backgrounds |
| Dark (for dark theme) | `#1a1a2e` | Dark section backgrounds |
| Dark text (for dark theme) | `#e0e0e0` | Text on dark backgrounds |
| Dark link (for dark theme) | `#66ccff` | Links on dark backgrounds |

### Typography

| Element | Size | Weight |
|---------|------|--------|
| H1 | 24px | 700 |
| H2 | 20px | 700 |
| H3 | 18px | 600 |
| H4 | 16px | 600 |
| Body | 15px | 400 |
| Small / labels | 13px | 400 |

Font: `system-ui, -apple-system, sans-serif`

### Spacing

| Use | Value |
|-----|-------|
| Box padding | 16px |
| Section gap | 24px |
| Inner element gap | 12px |
| Border radius | 4px |
| Table cell padding | 10px 12px |

---

## Accessibility Requirements

Canvas pages must meet basic accessibility standards (WCAG 2.1 AA). Apply these rules to every page you generate:

### Images
- Every `<img>` must have a descriptive `alt` attribute. Use `alt=""` only for purely decorative images.
- Alt text should describe the content or function, not just say "image" or "photo."

### Headings
- Use headings in order: `<h1>` then `<h2>` then `<h3>`. Never skip levels (e.g., `<h1>` directly to `<h3>`).
- Each page should have exactly one `<h1>` (typically inside the page header element).

### Color Contrast
- Body text (#495057) on white (#ffffff) meets AA. Do not use lighter text colors for primary content.
- On dark backgrounds (#1a1a2e), use light text (#e0e0e0 or #ffffff). Never use dark text on dark backgrounds.
- Do not rely on color alone to convey information -- pair color with text labels, icons (Unicode), or patterns.

### Links
- Use descriptive link text: "View the assignment rubric" not "Click here" or "Link."
- Links must be visually distinguishable from surrounding text (underline or color difference).

### Tables
- Always include `scope="col"` on `<th>` elements in table headers (already present in D01 template).
- Use `<caption>` for tables that need context (see D04).

### Semantic HTML
- Use `<h2>`, `<h3>` for headings, not bold `<div>` elements.
- Use `<ul>`, `<ol>` for lists, not manual bullet characters in paragraphs.
- Use `<blockquote>` for quotations, not styled `<div>` elements.

---

## Element Library

Each element has an ID, name, and HTML template. Faculty reference elements by ID.

---

### Layout (L series)

#### L01: Two-Column Table Layout

Use for side-by-side content blocks. Reliable across all Canvas versions.

```html
<table style="width: 100%; border-collapse: collapse; border: none;">
  <tr>
    <td style="width: 50%; padding: 16px; vertical-align: top;">
      LEFT CONTENT
    </td>
    <td style="width: 50%; padding: 16px; vertical-align: top;">
      RIGHT CONTENT
    </td>
  </tr>
</table>
```

#### L02: Three-Column Table Layout

For three even content areas.

```html
<table style="width: 100%; border-collapse: collapse; border: none;">
  <tr>
    <td style="width: 33.33%; padding: 16px; vertical-align: top;">
      COLUMN 1
    </td>
    <td style="width: 33.33%; padding: 16px; vertical-align: top;">
      COLUMN 2
    </td>
    <td style="width: 33.33%; padding: 16px; vertical-align: top;">
      COLUMN 3
    </td>
  </tr>
</table>
```

#### L03: Flexbox Row

Modern flexible layout. Wraps on small screens if `flex-wrap: wrap` is set.

```html
<div style="display: flex; gap: 16px; flex-wrap: wrap;">
  <div style="flex: 1; min-width: 200px; padding: 16px; background: #f8f8f8; border: 1px solid #dee2e6; border-radius: 4px;">
    COLUMN 1
  </div>
  <div style="flex: 1; min-width: 200px; padding: 16px; background: #f8f8f8; border: 1px solid #dee2e6; border-radius: 4px;">
    COLUMN 2
  </div>
</div>
```

#### L04: CSS Grid

Precise column control. Use `grid-template-columns` to set widths.

```html
<div style="display: grid; grid-template-columns: 1fr 2fr; gap: 16px;">
  <div style="padding: 16px; background: #f8f8f8; border: 1px solid #dee2e6; border-radius: 4px;">
    SIDEBAR
  </div>
  <div style="padding: 16px; background: #f8f8f8; border: 1px solid #dee2e6; border-radius: 4px;">
    MAIN CONTENT
  </div>
</div>
```

#### L05: Centered Container

Constrains content width for readability. Centers on page.

```html
<div style="max-width: 800px; margin: 0 auto; padding: 24px;">
  CONTENT
</div>
```

#### L06: Full-Width Section with Background

For visual separation between major sections.

```html
<div style="background: #f8f8f8; padding: 24px 16px; margin: 24px 0; border-top: 1px solid #dee2e6; border-bottom: 1px solid #dee2e6;">
  SECTION CONTENT
</div>
```

---

### Content Organization (C series)

#### C01: Collapsible Section

Click to expand/collapse. All sections start closed in Canvas (the `open` attribute is stripped).

```html
<details style="margin-bottom: 12px; border: 1px solid #dee2e6; border-radius: 4px;">
  <summary style="padding: 12px 16px; background: #f8f8f8; cursor: pointer; font-weight: 600; color: #333333;">
    SECTION TITLE
  </summary>
  <div style="padding: 16px;">
    SECTION CONTENT
  </div>
</details>
```

#### C02: Nested Collapsibles

Multi-level expandable content. Good for outlines and hierarchical information.

```html
<details style="margin-bottom: 12px; border: 1px solid #dee2e6; border-radius: 4px;">
  <summary style="padding: 12px 16px; background: #f8f8f8; cursor: pointer; font-weight: 600;">
    OUTER SECTION
  </summary>
  <div style="padding: 16px;">
    <p>Introductory text here.</p>
    <details style="margin-top: 12px; border: 1px solid #dee2e6; border-radius: 4px;">
      <summary style="padding: 10px 14px; background: #ffffff; cursor: pointer; font-weight: 600;">
        INNER SECTION
      </summary>
      <div style="padding: 14px;">
        INNER CONTENT
      </div>
    </details>
  </div>
</details>
```

#### C03: Info Card

Boxed content block with a header. Use for announcements, key info, resources.

```html
<div style="border: 1px solid #dee2e6; border-radius: 4px; margin-bottom: 16px; overflow: hidden;">
  <div style="background: #f8f8f8; padding: 12px 16px; font-weight: 600; color: #333333; border-bottom: 1px solid #dee2e6;">
    CARD TITLE
  </div>
  <div style="padding: 16px;">
    CARD CONTENT
  </div>
</div>
```

#### C04: Definition List

For term-definition pairs. Good for glossaries, FAQs, key terms.

```html
<dl style="margin: 0; padding: 0;">
  <dt style="font-weight: 600; color: #333333; margin-top: 12px;">TERM 1</dt>
  <dd style="margin: 4px 0 0 20px; color: #495057;">Definition of term 1.</dd>
  <dt style="font-weight: 600; color: #333333; margin-top: 12px;">TERM 2</dt>
  <dd style="margin: 4px 0 0 20px; color: #495057;">Definition of term 2.</dd>
</dl>
```

#### C05: Styled Definition List with Border Accent

Adds a left border for visual emphasis.

```html
<dl style="margin: 0; padding: 0;">
  <dt style="font-weight: 600; color: #333333; margin-top: 16px; padding-bottom: 4px; border-bottom: 1px solid #dee2e6;">TERM</dt>
  <dd style="margin: 8px 0 0 0; padding-left: 16px; border-left: 3px solid #0066cc; color: #495057;">
    Definition with left border accent for visual hierarchy.
  </dd>
</dl>
```

#### C06: Ordered List Variants

Standard numbered, lettered, or roman numeral lists.

```html
<!-- Numbered (default) -->
<ol style="padding-left: 24px; color: #495057;">
  <li>First item</li>
  <li>Second item</li>
</ol>

<!-- Lettered -->
<ol type="A" style="padding-left: 24px; color: #495057;">
  <li>Item A</li>
  <li>Item B</li>
</ol>

<!-- Roman numerals -->
<ol type="i" style="padding-left: 24px; color: #495057;">
  <li>Item i</li>
  <li>Item ii</li>
</ol>

<!-- Starting at a custom number -->
<ol start="5" style="padding-left: 24px; color: #495057;">
  <li>Fifth item</li>
  <li>Sixth item</li>
</ol>
```

#### C07: Checklist

Uses Unicode markers for visual checklists. Not interactive -- purely visual.

```html
<ul style="list-style: none; padding-left: 8px; color: #495057;">
  <li style="margin-bottom: 6px;">&#9745; Completed task</li>
  <li style="margin-bottom: 6px;">&#9744; Incomplete task</li>
  <li style="margin-bottom: 6px;">&#9744; Another incomplete task</li>
</ul>
```

#### C08: Captioned Code Block

Code with a descriptive caption below. Uses `<figure>` and `<figcaption>`.

```html
<figure style="margin: 16px 0;">
  <pre style="background: #f8f8f8; border: 1px solid #dee2e6; border-radius: 4px; padding: 16px; overflow-x: auto; font-family: monospace; font-size: 14px; color: #333333;"><code>function example() {
  return "Canvas-safe code block";
}</code></pre>
  <figcaption style="margin-top: 8px; font-size: 13px; color: #6c757d; font-style: italic;">
    Figure 1: Example code caption
  </figcaption>
</figure>
```

#### C09: Basic Unordered List

Styled bullet list for general content. The most common content element.

```html
<ul style="padding-left: 24px; color: #495057; margin-bottom: 12px;">
  <li style="margin-bottom: 6px;">First item</li>
  <li style="margin-bottom: 6px;">Second item</li>
  <li style="margin-bottom: 6px;">Third item</li>
</ul>
```

Nested variant:

```html
<ul style="padding-left: 24px; color: #495057; margin-bottom: 12px;">
  <li style="margin-bottom: 6px;">Main item
    <ul style="padding-left: 20px; margin-top: 6px;">
      <li style="margin-bottom: 4px;">Sub-item A</li>
      <li style="margin-bottom: 4px;">Sub-item B</li>
    </ul>
  </li>
  <li style="margin-bottom: 6px;">Another main item</li>
</ul>
```

---

### Typography (T series)

#### T01: Styled Heading

Headings with bottom border for section separation.

```html
<h2 style="color: #333333; font-size: 20px; font-weight: 700; padding-bottom: 8px; border-bottom: 2px solid #0066cc; margin-bottom: 16px; font-family: system-ui, -apple-system, sans-serif;">
  SECTION TITLE
</h2>
```

#### T02: Highlighted Text

Draw attention to key terms or phrases inline.

```html
<mark style="background-color: #fff3cd; padding: 2px 6px; border-radius: 2px;">highlighted text</mark>
```

Custom colors:

```html
<mark style="background-color: #d4edda; padding: 2px 6px; border-radius: 2px;">green highlight</mark>
<mark style="background-color: #f8d7da; padding: 2px 6px; border-radius: 2px;">red highlight</mark>
<mark style="background-color: #cce5ff; padding: 2px 6px; border-radius: 2px;">blue highlight</mark>
```

#### T03: Abbreviation with Tooltip

Hover to see full term. Good for jargon, acronyms.

```html
<abbr title="Rich Content Editor">RCE</abbr>
```

#### T04: Inserted and Deleted Text

Show additions and removals. Useful for revision tracking or changelogs.

```html
<del style="color: #dc3545; text-decoration: line-through;">removed text</del>
<ins style="color: #28a745; text-decoration: underline;">added text</ins>
```

#### T05: Keyboard Shortcut

Display keyboard keys or terminal commands.

```html
<kbd style="background: #f8f8f8; border: 1px solid #cccccc; border-radius: 3px; padding: 2px 6px; font-family: monospace; font-size: 13px;">Ctrl</kbd> + <kbd style="background: #f8f8f8; border: 1px solid #cccccc; border-radius: 3px; padding: 2px 6px; font-family: monospace; font-size: 13px;">S</kbd>
```

For terminal output:

```html
<samp style="font-family: monospace; color: #6c757d;">Program exited with code 0</samp>
```

For variables:

```html
<var style="font-style: italic; color: #0066cc;">x</var>
```

#### T06: Styled Blockquote

Visually distinct quotation or callout.

```html
<blockquote style="margin: 16px 0; padding: 16px 20px; border-left: 4px solid #0066cc; background: #f8f8f8; color: #495057; font-style: italic; border-radius: 0 4px 4px 0;">
  <p style="margin: 0;">Quote or important statement goes here.</p>
  <footer style="margin-top: 8px; font-size: 13px; color: #6c757d; font-style: normal;">-- Attribution</footer>
</blockquote>
```

#### T07: Styled Horizontal Rule

Visual section divider with customized appearance.

```html
<hr style="border: none; border-top: 2px solid #dee2e6; margin: 24px 0;">
```

Accent colored:

```html
<hr style="border: none; border-top: 3px solid #0066cc; margin: 24px 0; max-width: 100px;">
```

#### T08: Superscript and Subscript

For footnotes, chemical formulas, or mathematical notation.

```html
<!-- Footnote reference -->
<sup style="color: #0066cc; font-size: 11px;">[1]</sup>

<!-- Chemical formula -->
H<sub>2</sub>O

<!-- Math -->
x<sup>2</sup> + y<sup>2</sup> = z<sup>2</sup>
```

#### T09: Text Truncation

For long titles or labels that should not wrap. Shows ellipsis when overflowing.

```html
<div style="max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #495057;">
  This is a very long title that will be truncated with an ellipsis
</div>
```

---

### Data Display (D series)

#### D01: Data Table

Standard table with header, body, and optional footer.

```html
<table style="width: 100%; border-collapse: collapse; border: 1px solid #dee2e6;">
  <thead>
    <tr style="background: #f8f8f8;">
      <th style="padding: 10px 12px; text-align: left; border: 1px solid #dee2e6; font-weight: 600; color: #333333;" scope="col">HEADER 1</th>
      <th style="padding: 10px 12px; text-align: left; border: 1px solid #dee2e6; font-weight: 600; color: #333333;" scope="col">HEADER 2</th>
      <th style="padding: 10px 12px; text-align: left; border: 1px solid #dee2e6; font-weight: 600; color: #333333;" scope="col">HEADER 3</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 10px 12px; border: 1px solid #dee2e6; color: #495057;">Data</td>
      <td style="padding: 10px 12px; border: 1px solid #dee2e6; color: #495057;">Data</td>
      <td style="padding: 10px 12px; border: 1px solid #dee2e6; color: #495057;">Data</td>
    </tr>
  </tbody>
</table>
```

#### D02: Merged Cell Table

Use `colspan` and `rowspan` for complex layouts within tables.

```html
<table style="width: 100%; border-collapse: collapse; border: 1px solid #dee2e6;">
  <tr style="background: #f8f8f8;">
    <th colspan="2" style="padding: 10px 12px; border: 1px solid #dee2e6; text-align: center; font-weight: 600;">MERGED HEADER</th>
  </tr>
  <tr>
    <td rowspan="2" style="padding: 10px 12px; border: 1px solid #dee2e6; vertical-align: top; font-weight: 600;">SPANNING ROW</td>
    <td style="padding: 10px 12px; border: 1px solid #dee2e6;">Row 1 data</td>
  </tr>
  <tr>
    <td style="padding: 10px 12px; border: 1px solid #dee2e6;">Row 2 data</td>
  </tr>
</table>
```

#### D03: Column-Styled Table

Apply consistent styling to entire columns using `<colgroup>`.

```html
<table style="width: 100%; border-collapse: collapse; border: 1px solid #dee2e6;">
  <colgroup>
    <col style="background: #f8f8f8; width: 30%;">
    <col style="width: 70%;">
  </colgroup>
  <tr>
    <th style="padding: 10px 12px; border: 1px solid #dee2e6; text-align: left; font-weight: 600;">Label</th>
    <td style="padding: 10px 12px; border: 1px solid #dee2e6;">Value</td>
  </tr>
  <tr>
    <th style="padding: 10px 12px; border: 1px solid #dee2e6; text-align: left; font-weight: 600;">Label</th>
    <td style="padding: 10px 12px; border: 1px solid #dee2e6;">Value</td>
  </tr>
</table>
```

#### D04: Captioned Table

Table with a visible caption/title.

```html
<table style="width: 100%; border-collapse: collapse; border: 1px solid #dee2e6;">
  <caption style="padding: 10px; font-weight: 600; font-size: 16px; color: #333333; text-align: left; caption-side: top;">
    TABLE TITLE
  </caption>
  <thead>
    <tr style="background: #f8f8f8;">
      <th style="padding: 10px 12px; border: 1px solid #dee2e6; text-align: left;" scope="col">Column A</th>
      <th style="padding: 10px 12px; border: 1px solid #dee2e6; text-align: left;" scope="col">Column B</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 10px 12px; border: 1px solid #dee2e6;">Data</td>
      <td style="padding: 10px 12px; border: 1px solid #dee2e6;">Data</td>
    </tr>
  </tbody>
</table>
```

#### D05: Schedule Grid

Week-by-week or session-by-session schedule layout. Uses merged cells for multi-day spans.

```html
<table style="width: 100%; border-collapse: collapse; border: 1px solid #dee2e6;">
  <thead>
    <tr style="background: #333333; color: #ffffff;">
      <th style="padding: 10px 12px; border: 1px solid #dee2e6; width: 80px;" scope="col">Week</th>
      <th style="padding: 10px 12px; border: 1px solid #dee2e6;" scope="col">Date</th>
      <th style="padding: 10px 12px; border: 1px solid #dee2e6;" scope="col">Topic</th>
      <th style="padding: 10px 12px; border: 1px solid #dee2e6;" scope="col">Due</th>
    </tr>
  </thead>
  <tbody>
    <tr style="background: #f8f8f8;">
      <td rowspan="2" style="padding: 10px 12px; border: 1px solid #dee2e6; font-weight: 600; text-align: center; vertical-align: top;">1</td>
      <td style="padding: 10px 12px; border: 1px solid #dee2e6;">Sep 3</td>
      <td style="padding: 10px 12px; border: 1px solid #dee2e6;">Introduction</td>
      <td style="padding: 10px 12px; border: 1px solid #dee2e6;">--</td>
    </tr>
    <tr style="background: #f8f8f8;">
      <td style="padding: 10px 12px; border: 1px solid #dee2e6;">Sep 5</td>
      <td style="padding: 10px 12px; border: 1px solid #dee2e6;">Tools Setup</td>
      <td style="padding: 10px 12px; border: 1px solid #dee2e6;">Reading 1</td>
    </tr>
    <tr>
      <td rowspan="2" style="padding: 10px 12px; border: 1px solid #dee2e6; font-weight: 600; text-align: center; vertical-align: top;">2</td>
      <td style="padding: 10px 12px; border: 1px solid #dee2e6;">Sep 10</td>
      <td style="padding: 10px 12px; border: 1px solid #dee2e6;">Core Concepts</td>
      <td style="padding: 10px 12px; border: 1px solid #dee2e6;">--</td>
    </tr>
    <tr>
      <td style="padding: 10px 12px; border: 1px solid #dee2e6;">Sep 12</td>
      <td style="padding: 10px 12px; border: 1px solid #dee2e6;">Workshop</td>
      <td style="padding: 10px 12px; border: 1px solid #dee2e6;">Assignment 1</td>
    </tr>
  </tbody>
</table>
```

#### D06: Comparison Table

Side-by-side feature or option comparison.

```html
<table style="width: 100%; border-collapse: collapse; border: 1px solid #dee2e6;">
  <thead>
    <tr>
      <th style="padding: 10px 12px; border: 1px solid #dee2e6; background: #f8f8f8;" scope="col">Feature</th>
      <th style="padding: 10px 12px; border: 1px solid #dee2e6; background: #d4edda; text-align: center;" scope="col">Option A</th>
      <th style="padding: 10px 12px; border: 1px solid #dee2e6; background: #cce5ff; text-align: center;" scope="col">Option B</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 10px 12px; border: 1px solid #dee2e6; font-weight: 600;">Feature 1</td>
      <td style="padding: 10px 12px; border: 1px solid #dee2e6; text-align: center;">&#9745;</td>
      <td style="padding: 10px 12px; border: 1px solid #dee2e6; text-align: center;">&#9744;</td>
    </tr>
    <tr>
      <td style="padding: 10px 12px; border: 1px solid #dee2e6; font-weight: 600;">Feature 2</td>
      <td style="padding: 10px 12px; border: 1px solid #dee2e6; text-align: center;">&#9744;</td>
      <td style="padding: 10px 12px; border: 1px solid #dee2e6; text-align: center;">&#9745;</td>
    </tr>
  </tbody>
</table>
```

#### D07: Div-Based Progress Bar

Visual progress indicator using only divs and inline styles. Replaces `<meter>` and `<progress>` which Canvas strips.

```html
<div style="margin-bottom: 8px; font-size: 13px; color: #495057;">Progress: 65%</div>
<div style="background: #dee2e6; border-radius: 4px; overflow: hidden; height: 20px;">
  <div style="background: #0066cc; height: 100%; width: 65%; border-radius: 4px;"></div>
</div>
```

Multi-bar variant (e.g., grading breakdown):

```html
<div style="margin-bottom: 12px;">
  <div style="display: flex; justify-content: space-between; font-size: 13px; color: #495057; margin-bottom: 4px;">
    <span>Participation</span><span>25%</span>
  </div>
  <div style="background: #dee2e6; border-radius: 4px; overflow: hidden; height: 12px;">
    <div style="background: #0066cc; height: 100%; width: 25%; border-radius: 4px;"></div>
  </div>
</div>
```

---

### Visual Indicators (V series)

#### V01: Left-Border Accent Box

Content box with a colored left border for emphasis.

```html
<div style="border-left: 4px solid #0066cc; padding: 16px; margin: 16px 0; background: #f8f8f8; border-radius: 0 4px 4px 0;">
  <strong style="color: #333333;">NOTE:</strong>
  <span style="color: #495057;"> Important information goes here.</span>
</div>
```

#### V02: Color-Coded Header

Page or section header with a distinctive background color. Use to differentiate page types (lecture vs. lab vs. workshop).

```html
<!-- Blue header (lectures) -->
<div style="background: #0066cc; color: #ffffff; padding: 16px 20px; margin-bottom: 24px; border-radius: 4px;">
  <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #ffffff;">PAGE TITLE</h1>
  <p style="margin: 8px 0 0; font-size: 14px; color: #cce5ff;">Subtitle or date</p>
</div>

<!-- Green header (workshops) -->
<div style="background: #28a745; color: #ffffff; padding: 16px 20px; margin-bottom: 24px; border-radius: 4px;">
  <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #ffffff;">WORKSHOP TITLE</h1>
  <p style="margin: 8px 0 0; font-size: 14px; color: #d4edda;">Date or session</p>
</div>

<!-- Orange header (labs / dev days) -->
<div style="background: #e67e22; color: #ffffff; padding: 16px 20px; margin-bottom: 24px; border-radius: 4px;">
  <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #ffffff;">LAB TITLE</h1>
  <p style="margin: 8px 0 0; font-size: 14px; color: #fdebd0;">Lab number or topic</p>
</div>
```

#### V03: Alert / Callout Box

For warnings, tips, or important notices.

```html
<!-- Warning -->
<div style="padding: 16px; margin: 16px 0; background: #fff3cd; border: 1px solid #ffc107; border-radius: 4px;">
  <strong style="color: #856404;">&#9888; Warning:</strong>
  <span style="color: #856404;"> Warning message here.</span>
</div>

<!-- Success / Tip -->
<div style="padding: 16px; margin: 16px 0; background: #d4edda; border: 1px solid #28a745; border-radius: 4px;">
  <strong style="color: #155724;">&#10004; Tip:</strong>
  <span style="color: #155724;"> Helpful tip here.</span>
</div>

<!-- Danger / Don't -->
<div style="padding: 16px; margin: 16px 0; background: #f8d7da; border: 1px solid #dc3545; border-radius: 4px;">
  <strong style="color: #721c24;">&#10006; Important:</strong>
  <span style="color: #721c24;"> Critical warning here.</span>
</div>

<!-- Info -->
<div style="padding: 16px; margin: 16px 0; background: #cce5ff; border: 1px solid #0066cc; border-radius: 4px;">
  <strong style="color: #004085;">&#8505; Note:</strong>
  <span style="color: #004085;"> Informational note here.</span>
</div>
```

#### V04: Status Badge

Small label positioned over or beside content. Uses relative/absolute positioning.

```html
<div style="position: relative; display: inline-block;">
  <span style="position: absolute; top: -8px; right: -8px; background: #dc3545; color: #ffffff; font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 10px;">
    NEW
  </span>
  <div style="padding: 16px; border: 1px solid #dee2e6; border-radius: 4px; margin-top: 8px;">
    Content with a badge
  </div>
</div>
```

Inline badge:

```html
<span style="display: inline-block; background: #0066cc; color: #ffffff; font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 10px; vertical-align: middle;">
  REQUIRED
</span>
```

#### V05: Gradient Header

Banner with a gradient background. More visually distinct than solid color headers.

```html
<div style="background: linear-gradient(135deg, #0066cc, #004499); color: #ffffff; padding: 24px 20px; margin-bottom: 24px; border-radius: 4px;">
  <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #ffffff;">PAGE TITLE</h1>
  <p style="margin: 8px 0 0; font-size: 15px; color: #b3d9ff;">Supporting description text</p>
</div>
```

#### V06: Dark Theme Section

A section with dark background. Use for visual contrast or emphasis.

```html
<div style="background: #1a1a2e; color: #e0e0e0; padding: 24px; margin: 24px 0; border-radius: 4px;">
  <h2 style="color: #ffffff; margin-top: 0;">SECTION TITLE</h2>
  <p style="color: #e0e0e0; margin-bottom: 0;">Content on dark background. <a href="#" style="color: #66ccff;">Links use light blue.</a></p>
</div>
```

---

### Navigation (N series)

#### N01: Anchor Link Table of Contents

Jump links to sections within the same page.

```html
<div style="background: #f8f8f8; border: 1px solid #dee2e6; border-radius: 4px; padding: 16px; margin-bottom: 24px;">
  <h3 style="margin-top: 0; color: #333333;">Contents</h3>
  <ol style="padding-left: 24px; color: #495057;">
    <li><a href="#section-1" style="color: #0066cc;">Section One</a></li>
    <li><a href="#section-2" style="color: #0066cc;">Section Two</a></li>
    <li><a href="#section-3" style="color: #0066cc;">Section Three</a></li>
  </ol>
</div>

<!-- Then later in the page: -->
<h2 id="section-1">Section One</h2>
```

#### N02: Button-Styled Links

Links styled as clickable buttons for CTAs or resource links.

```html
<a href="URL_HERE" style="display: inline-block; padding: 10px 20px; background: #0066cc; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: 600; font-size: 15px;">
  BUTTON TEXT
</a>
```

Secondary variant:

```html
<a href="URL_HERE" style="display: inline-block; padding: 10px 20px; background: #ffffff; color: #0066cc; text-decoration: none; border: 2px solid #0066cc; border-radius: 4px; font-weight: 600; font-size: 15px;">
  SECONDARY BUTTON
</a>
```

Button row:

```html
<div style="display: flex; gap: 12px; flex-wrap: wrap; margin: 16px 0;">
  <a href="URL_1" style="display: inline-block; padding: 10px 20px; background: #0066cc; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: 600;">Button 1</a>
  <a href="URL_2" style="display: inline-block; padding: 10px 20px; background: #28a745; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: 600;">Button 2</a>
  <a href="URL_3" style="display: inline-block; padding: 10px 20px; background: #6c757d; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: 600;">Button 3</a>
</div>
```

---

### Canvas Integration (X series)

These elements use Canvas-specific URL patterns and embed features.

#### X01: Canvas Assignment Link

Link to a Canvas assignment using the API endpoint pattern. Replace `COURSE_ID` and `ASSIGNMENT_ID`.

```html
<a href="/courses/COURSE_ID/assignments/ASSIGNMENT_ID" style="color: #0066cc; font-weight: 600;">
  Assignment Name
</a>
```

#### X02: Canvas File Embed

Embed an image hosted in Canvas Files. Replace `COURSE_ID` and `FILE_ID`. Get the URL from Canvas Files.

```html
<figure style="margin: 16px 0; text-align: center;">
  <img src="/courses/COURSE_ID/files/FILE_ID/preview" alt="DESCRIPTION" style="max-width: 100%; height: auto; border-radius: 4px;">
  <figcaption style="margin-top: 8px; font-size: 13px; color: #6c757d; font-style: italic;">Caption text</figcaption>
</figure>
```

#### X03: Canvas Page Link

Link to another Canvas page (wiki page).

```html
<a href="/courses/COURSE_ID/pages/page-url-slug" style="color: #0066cc;">Page Title</a>
```

#### X04: Video Embed (iframe)

Embed YouTube, Vimeo, or institutional video (YUJA, Panopto, etc.).

```html
<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; margin: 16px 0; border-radius: 4px;">
  <iframe src="https://www.youtube.com/embed/VIDEO_ID" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;" allowfullscreen></iframe>
</div>
```

#### X05: Audio Player

Native HTML5 audio player. Upload audio to Canvas Files first.

```html
<div style="margin: 16px 0;">
  <p style="font-weight: 600; color: #333333; margin-bottom: 8px;">AUDIO TITLE</p>
  <audio controls style="width: 100%;">
    <source src="/courses/COURSE_ID/files/FILE_ID/preview" type="audio/mpeg">
  </audio>
</div>
```

#### X06: Video Player

Native HTML5 video player. Upload video to Canvas Files first.

```html
<div style="margin: 16px 0;">
  <video controls style="max-width: 100%; border-radius: 4px;">
    <source src="/courses/COURSE_ID/files/FILE_ID/preview" type="video/mp4">
  </video>
</div>
```

---

### External Media (E series)

#### E01: GitHub-Hosted Image

Image hosted on faculty's own GitHub Pages site. Faculty provide their GitHub Pages base URL and image filenames. Always build complete absolute URLs -- never use relative paths. Replace `GITHUB_PAGES_BASE` with the base URL faculty provides.

```html
<div style="text-align: center; margin: 16px 0;">
  <img src="GITHUB_PAGES_BASE/images/photo.jpg"
       alt="Descriptive alt text"
       style="max-width: 100%; height: auto; border-radius: 4px;">
  <p style="font-size: 0.85em; color: #666666; margin-top: 6px;">Caption text</p>
</div>
```

Example with a real URL: `<img src="https://npuckett.github.io/my-course/images/photo.jpg" ...>`

#### E02: External Website Embed

Embed an external website (p5.js sketch, data visualization, interactive widget) via iframe. Faculty provide the full URL of the page to embed. The URL must be absolute -- Canvas cannot resolve relative paths. Wrap in a container div with `overflow: hidden` to crop the visible area.

```html
<div style="text-align: center; overflow: hidden; height: 200px; margin: 16px 0; border-radius: 4px;">
  <iframe src="https://username.github.io/my-sketch/"
          style="width: 100%; height: 300px; border: none; display: block; margin: 0 auto;"
          scrolling="no"
          frameborder="0"
          allowtransparency="true">
  </iframe>
</div>
```

Key details:
- Container `height` controls visible area; iframe `height` can be larger to hide unwanted regions (e.g., scrollbars, footers).
- The embedded page can use `<style>`, `<script>`, `<svg>`, and everything Canvas strips -- because it loads in its own document context inside the iframe.
- Set explicit heights to prevent layout shift.

#### E03: Linked Image

GitHub-hosted image wrapped in a link, useful for thumbnails linking to full-size versions. Both `href` and `src` must be absolute URLs built from the faculty's GitHub Pages base URL.

```html
<div style="text-align: center; margin: 16px 0;">
  <a href="GITHUB_PAGES_BASE/images/full-size.jpg" target="_blank" rel="noopener">
    <img src="GITHUB_PAGES_BASE/images/thumbnail.jpg"
         alt="Click to view full size"
         style="max-width: 100%; height: auto; border-radius: 4px;">
  </a>
</div>
```

Example: `<a href="https://npuckett.github.io/my-course/images/photo.jpg">` with the same pattern for the `<img>` src.

---

## Transformation Workflow

When a faculty member provides content, follow these steps:

### Step 1: Analyze the Content

Identify what the content is:
- **Schedule data** (dates, topics, due dates) --> D05 Schedule Grid or D01 Data Table
- **Descriptive sections** (paragraphs with headings) --> C01 Collapsibles or L06 Sections with T01 Headings
- **Comparison or feature list** --> D06 Comparison Table
- **Resource links** --> N02 Button-Styled Links or simple link lists
- **Procedures or steps** --> C06 Ordered Lists
- **Term definitions or FAQs** --> C04/C05 Definition Lists
- **Mixed content page** --> Combine elements as needed

### Step 2: Choose Layout

- Single-column content: L05 Centered Container or plain flow
- Two areas side by side: L01 Table Layout or L03 Flexbox
- Sidebar + main: L04 CSS Grid with `1fr 2fr`
- Card grid: L03 Flexbox with multiple children

### Step 3: Add Visual Hierarchy

- Page header: V02 Color-Coded Header or V05 Gradient Header
- Section dividers: T07 Styled Horizontal Rule or T01 Styled Heading
- Important notices: V03 Alert Box or V01 Left-Border Accent Box
- Status indicators: V04 Badge or D07 Progress Bar

### Step 4: Generate Complete HTML

Output a complete HTML fragment (not a full HTML document -- no `<html>`, `<head>`, or `<body>` tags). The output will be pasted directly into Canvas RCE's HTML view.

Rules:
- Every style must be inline (`style=""`)
- No `<style>` blocks, no `<script>` tags
- No class attributes (Canvas may strip custom classes)
- Use only confirmed-working CSS properties from the constraints section
- All colors, fonts, and spacing inline
- Use semantic HTML where possible (`<h2>` not `<div>` for headings)
- Images use `[CANVAS_IMAGE_URL]` placeholder unless a real URL is provided

### Step 5: Verify Against Constraints

Before outputting, verify:
- [ ] No `<style>` blocks
- [ ] No `<script>` tags
- [ ] No SVG elements
- [ ] No `box-shadow`, `text-shadow`, `opacity`, `transform`, `letter-spacing`
- [ ] No `<meter>`, `<progress>`, `<fieldset>`, `<legend>`
- [ ] No `data:` URIs in image sources
- [ ] All styles are inline
- [ ] Images use Canvas URLs or `[CANVAS_IMAGE_URL]` placeholders

---

## Output Guidance

When generating HTML for faculty, follow these presentation rules:

### Before the HTML

Always include a brief plain-language summary before the HTML code that tells the faculty member:
1. What layout and elements you chose and why
2. How to use the output: "Copy all the HTML below, open your Canvas page, click the HTML editor icon (`</>` in the toolbar), paste it in, and click Save."
3. Any placeholders they need to fill in (e.g., `[CANVAS_IMAGE_URL]`, assignment links)

### Inside the HTML

Add HTML comments labeling major sections so faculty can find and edit content later:
```html
<!-- HEADER -->
<!-- SCHEDULE TABLE -->
<!-- RESOURCES (collapsible) -->
```

### When Requests Cannot Be Fulfilled

If a faculty member requests something Canvas strips (animations, shadows, dropdown menus, interactive forms, embedded scripts), do NOT silently substitute. Instead:
1. Briefly explain what Canvas does not support and why
2. Describe the Canvas-safe alternative you used instead
3. Generate the page using the best available substitute

Examples:
- "Animated headers" → Explain that Canvas strips JavaScript; use a V05 gradient header for visual impact instead
- "Drop shadows" → Explain that `box-shadow` is stripped; use borders and background colors for depth
- "Dropdown navigation" → Explain that JS is stripped; use C01 collapsible sections or N01 anchor links
- "Interactive progress bar" → Explain that `<progress>` is stripped; use D07 static div-based bar

### When No Element IDs Are Referenced

Many faculty will describe their page in plain language without referencing element IDs. This is expected and supported. Analyze their content and select appropriate elements from the library. Briefly note which elements you chose in your summary so they can reference those IDs in future requests.

---

## Course-Specific Templates

Faculty can define a course-specific template that overrides the defaults. When a template is provided, apply it consistently across all generated pages.

A course template typically specifies:
- **Primary color** and **accent color** for headers and accents
- **Page header style** (which V-series element, with custom colors)
- **Standard sections** that appear on every page (e.g., "Today's Agenda", "Resources", "Next Class")
- **Layout preference** (which L-series element for the main content)
- **Recurring elements** (e.g., always include a collapsible "Additional Resources" section)

Example template definition from faculty:

```
Course: ART 205 Interactive Design
Primary color: #2c3e50
Accent color: #e74c3c
Header: gradient from primary to #1a252f
Every class page should have:
  - Gradient header with class number and date
  - "Today's Agenda" section (ordered list)
  - Main content area
  - Collapsible "Resources" section at the bottom
  - Collapsible "Next Class Preview" section
Layout: single column, centered (800px max)
```

When this template is provided alongside content, generate HTML that follows these preferences while using the element library for implementation.

---

## Anti-Patterns

### Never generate these -- Canvas will strip or break them:

| Pattern | Why it fails |
|---------|-------------|
| `<style>` blocks | Completely stripped |
| `<script>` tags | Completely stripped |
| `class="..."` for styling | Classes may be stripped; styles won't apply |
| `<svg>` elements | Completely stripped |
| `<meter>` or `<progress>` | Completely stripped; use D07 div-based bar |
| `<fieldset>` / `<legend>` | Stripped |
| `style="box-shadow: ..."` | Property stripped |
| `style="text-shadow: ..."` | Property stripped |
| `style="opacity: ..."` | Property stripped |
| `style="transform: ..."` | Property stripped |
| `style="letter-spacing: ..."` | Property stripped |
| `<details open>` | The `open` attribute is stripped; sections always start closed |
| `<ol reversed>` | The `reversed` attribute is stripped |
| `src="data:image/..."` | Data URIs blocked entirely |
| External font links | `<link>` tags stripped |
| `<img>` with unknown external URLs | May be blocked by CSP; use Canvas-hosted, GitHub Pages, or other approved-domain URLs |
| Full HTML documents | Do not include `<html>`, `<head>`, `<body>` -- only fragments |
