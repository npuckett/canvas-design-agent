/*
 * Canvas Design Agent — element/theme catalog.
 * Generated from .github/SKILL.md. Plain browser JS, no modules.
 * HTML strings are byte-for-byte copies of the SKILL.md templates —
 * the theming engine string-matches the S01 literal values, so do not reformat.
 */
window.CATALOG = {
  version: 1,

  themes: {
    S01: {
      id: "S01",
      name: "Clean Modern",
      description: "Minimal black-and-white palette with a single accent color. This is the standard look when no theme is specified.",
      colors: {
        text: "#495057",
        headings: "#333333",
        muted: "#6c757d",
        link: "#0066cc",
        lightBg: "#f8f8f8",
        border: "#dee2e6",
        darkBg: "#1a1a2e",
        darkText: "#e0e0e0",
        accent: "#0066cc"
      },
      font: "system-ui, -apple-system, sans-serif",
      radius: "4px",
      headerGradient: "linear-gradient(135deg, #0066cc, #004499)",
      notes: "Header: V02 or V05 with linear-gradient(135deg, #0066cc, #004499)."
    },
    S02: {
      id: "S02",
      name: "Bold Academic",
      description: "High-contrast, serif typography with deep navy and crimson accents. Strong visual hierarchy for text-heavy courses (humanities, writing, history).",
      colors: {
        text: "#2d2d2d",
        headings: "#1a1a2e",
        muted: "#555555",
        link: "#b71c1c",
        lightBg: "#f5f0eb",
        border: "#c9c0b6",
        darkBg: "#1a1a2e",
        darkText: "#f5f0eb",
        accent: "#e74c3c"
      },
      font: "Georgia, 'Times New Roman', serif",
      radius: "0px",
      headerGradient: "linear-gradient(135deg, #1a1a2e, #2c3e50)",
      notes: "Header: V05 with linear-gradient(135deg, #1a1a2e, #2c3e50) and accent #e74c3c for border-bottom or highlight."
    },
    S03: {
      id: "S03",
      name: "Warm Minimal",
      description: "Soft earth tones, rounded corners, approachable serif font. Good for studio arts, design, education courses where the tone should feel inviting.",
      colors: {
        text: "#4e3629",
        headings: "#5d4037",
        muted: "#8d6e63",
        link: "#e67e22",
        lightBg: "#fdf6ee",
        border: "#d7ccc8",
        darkBg: "#5d4037",
        darkText: "#fdf6ee",
        accent: "#e67e22"
      },
      font: "Palatino, 'Book Antiqua', Georgia, serif",
      radius: "8px",
      headerGradient: "linear-gradient(135deg, #5d4037, #795548)",
      notes: "Header: V02 with background #5d4037 and text #fdf6ee, or V05 with linear-gradient(135deg, #5d4037, #795548)."
    },
    S04: {
      id: "S04",
      name: "High Contrast",
      description: "Accessibility-first theme with maximum readability. Pure black on white, large default sizing cues, wide sans-serif font. Use when accessibility is the top priority.",
      colors: {
        text: "#000000",
        headings: "#000000",
        muted: "#333333",
        link: "#0055aa",
        lightBg: "#ffffff",
        border: "#000000",
        darkBg: "#000000",
        darkText: "#ffffff",
        accent: "#0055aa"
      },
      font: "Verdana, Geneva, sans-serif",
      radius: "0px",
      headerGradient: null,
      notes: "Header: V02 with background #000000 and text #ffffff. Additional: Use font-size: 16px for body text (1px larger than default 15px). Use border-width: 2px instead of 1px for stronger visual separation."
    },
    S05: {
      id: "S05",
      name: "Studio Dark",
      description: "Creative and expressive — dark backgrounds with vibrant accent colors. Designed for art, design, media, and creative technology courses.",
      colors: {
        text: "#e0e0e0",
        headings: "#ffffff",
        muted: "#aaaaaa",
        link: "#ff6b6b",
        lightBg: "#2a2a3d",
        border: "#3d3d56",
        darkBg: "#1a1a2e",
        darkText: "#e0e0e0",
        accent: "#ff6b6b"
      },
      font: "system-ui, -apple-system, sans-serif",
      radius: "4px",
      headerGradient: "linear-gradient(135deg, #1a1a2e, #2a2a3d)",
      notes: "Header: V05 with linear-gradient(135deg, #1a1a2e, #2a2a3d) and accent #ff6b6b. Note: This theme inverts the typical light-background page. Use #1a1a2e or #2a2a3d as the page wrapper background; all card/box backgrounds use #2a2a3d or #3d3d56."
    },
    S06: {
      id: "S06",
      name: "Editorial",
      description: "Typography-driven, restrained design. White background, almost entirely grayscale with bold typographic structure. Content hierarchy is created through weight, size, and spatial relationships rather than color. Inspired by editorial/gallery design.",
      colors: {
        text: "#1a1a1a",
        headings: "#000000",
        muted: "#666666",
        link: "#333333",
        lightBg: "#f5f5f5",
        border: "#cccccc",
        darkBg: "#555555",
        darkText: "#ffffff",
        accent: "#000000"
      },
      font: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      radius: "0px",
      headerGradient: null,
      notes: "Header: V02 with no gradient — flat #f5f5f5 background with bold black text, or no header at all. Avoid colored banners; let typography carry the hierarchy. Additional: Use bold weight numbers (24px+) as section anchors. Date/label badges use black background with white text (background: #000; color: #fff). Content blocks use subtle border: 1px solid #ccc with #f5f5f5 header rows. Gray left-border accents (border-left: 3px solid #666 or 4px solid #888) replace colored accents. Submission/deadline callouts use slightly darker gray backgrounds (#e8e8e8) with border-left: 4px solid #333."
    },
    S07: {
      id: "S07",
      name: "Studio Light",
      description: "Light-background companion to Studio Dark. Same creative energy and vibrant coral accents on a clean white canvas. For creative courses where dark backgrounds aren't preferred or where Canvas theme constraints make light backgrounds easier.",
      colors: {
        text: "#2d2d3d",
        headings: "#1a1a2e",
        muted: "#6c6c8a",
        link: "#ff6b6b",
        lightBg: "#f4f4f8",
        border: "#d5d5e0",
        darkBg: "#1a1a2e",
        darkText: "#e0e0e0",
        accent: "#ff6b6b"
      },
      font: "system-ui, -apple-system, sans-serif",
      radius: "4px",
      headerGradient: null,
      notes: "Header: No banner. Course title and subtitle rendered directly on white background in dark text. Note: Clean white page background with vibrant coral accents — no dark header or banner. Card/box backgrounds use #f4f4f8 or #ffffff. Accent color #ff6b6b is used for buttons, callout borders, and highlights. Pairs well with the same project gallery and creative layout patterns as Studio Dark. (S07's spec has no dark background/text rows; darkBg/darkText are borrowed from S05.)"
    }
  },

  fonts: {
    F01: {
      id: "F01",
      name: "System Sans-Serif",
      stack: "system-ui, -apple-system, sans-serif",
      character: "Clean, neutral, modern",
      bestFor: "Default, tech, design, science courses"
    },
    F02: {
      id: "F02",
      name: "Traditional Serif",
      stack: "Georgia, 'Times New Roman', serif",
      character: "Traditional, authoritative",
      bestFor: "Humanities, writing, history, law"
    },
    F03: {
      id: "F03",
      name: "Elegant Serif",
      stack: "Palatino, 'Book Antiqua', Georgia, serif",
      character: "Elegant, refined, editorial",
      bestFor: "Literature, philosophy, fine arts"
    },
    F04: {
      id: "F04",
      name: "Wide Sans-Serif",
      stack: "Verdana, Geneva, sans-serif",
      character: "Wide, highly readable",
      bestFor: "Accessibility priority, any course"
    },
    F05: {
      id: "F05",
      name: "Monospace",
      stack: "'Courier New', Courier, monospace",
      character: "Technical, code-like",
      bestFor: "CS, programming, technical writing"
    }
  },

  palettes: {
    "ocean-blues": {
      name: "Ocean Blues",
      primary: "#1a5276",
      accent: "#2e86c1",
      link: "#2e86c1",
      goodWith: ["S01", "S04"]
    },
    "earth-tones": {
      name: "Earth Tones",
      primary: "#6d4c41",
      accent: "#a1887f",
      link: "#8d6e63",
      goodWith: ["S03", "S02"]
    },
    "sunset-warm": {
      name: "Sunset Warm",
      primary: "#c0392b",
      accent: "#e67e22",
      link: "#d35400",
      goodWith: ["S03", "S05"]
    },
    "forest-greens": {
      name: "Forest Greens",
      primary: "#1b5e20",
      accent: "#4caf50",
      link: "#2e7d32",
      goodWith: ["S01", "S02"]
    },
    "plum-gold": {
      name: "Plum & Gold",
      primary: "#4a148c",
      accent: "#ffc107",
      link: "#7b1fa2",
      goodWith: ["S05", "S02"]
    }
  },

  elements: [
    {
      id: "L01",
      category: "Layout",
      name: "Two-Column Table Layout",
      description: "Use for side-by-side content blocks. Reliable across all Canvas versions.",
      variants: [
        {
          name: "Default",
          html: `<table style="width: 100%; border-collapse: collapse; border: none;">
  <tr>
    <td style="width: 50%; padding: 16px; vertical-align: top;">
      LEFT CONTENT
    </td>
    <td style="width: 50%; padding: 16px; vertical-align: top;">
      RIGHT CONTENT
    </td>
  </tr>
</table>`
        }
      ]
    },
    {
      id: "L02",
      category: "Layout",
      name: "Three-Column Table Layout",
      description: "For three even content areas.",
      variants: [
        {
          name: "Default",
          html: `<table style="width: 100%; border-collapse: collapse; border: none;">
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
</table>`
        }
      ]
    },
    {
      id: "L03",
      category: "Layout",
      name: "Flexbox Row",
      description: "Modern flexible layout. Wraps on small screens if flex-wrap: wrap is set.",
      variants: [
        {
          name: "Default",
          html: `<div style="display: flex; gap: 16px; flex-wrap: wrap;">
  <div style="flex: 1; min-width: 200px; padding: 16px; background: #f8f8f8; border: 1px solid #dee2e6; border-radius: 4px;">
    COLUMN 1
  </div>
  <div style="flex: 1; min-width: 200px; padding: 16px; background: #f8f8f8; border: 1px solid #dee2e6; border-radius: 4px;">
    COLUMN 2
  </div>
</div>`
        }
      ]
    },
    {
      id: "L04",
      category: "Layout",
      name: "CSS Grid",
      description: "Precise column control. Use grid-template-columns to set widths.",
      variants: [
        {
          name: "Default",
          html: `<div style="display: grid; grid-template-columns: 1fr 2fr; gap: 16px;">
  <div style="padding: 16px; background: #f8f8f8; border: 1px solid #dee2e6; border-radius: 4px;">
    SIDEBAR
  </div>
  <div style="padding: 16px; background: #f8f8f8; border: 1px solid #dee2e6; border-radius: 4px;">
    MAIN CONTENT
  </div>
</div>`
        }
      ]
    },
    {
      id: "L05",
      category: "Layout",
      name: "Centered Container",
      description: "Constrains content width for readability. Centers on page.",
      variants: [
        {
          name: "Default",
          html: `<div style="max-width: 800px; margin: 0 auto; padding: 24px;">
  CONTENT
</div>`
        }
      ]
    },
    {
      id: "L06",
      category: "Layout",
      name: "Full-Width Section with Background",
      description: "For visual separation between major sections.",
      variants: [
        {
          name: "Default",
          html: `<div style="background: #f8f8f8; padding: 24px 16px; margin: 24px 0; border-top: 1px solid #dee2e6; border-bottom: 1px solid #dee2e6;">
  SECTION CONTENT
</div>`
        }
      ]
    },
    {
      id: "L07",
      category: "Layout",
      name: "Float Wrap",
      description: "Float an image (or iframe) to one side with text wrapping around it. Always place a clear: both div after the wrapping content to prevent layout bleed into the next section.",
      variants: [
        {
          name: "Image floated left, text wraps right",
          html: `<div>
  <img src="IMAGE_URL" alt="Description"
       style="float: left; margin: 0 16px 12px 0; max-width: 40%; height: auto; border-radius: 4px;">
  <p style="color: #495057;">Paragraph text wraps around the floated image. Add as many paragraphs as needed — they will continue flowing beside the image until the image ends.</p>
  <div style="clear: both;"></div>
</div>`
        },
        {
          name: "Image floated right",
          html: `<div>
  <img src="IMAGE_URL" alt="Description"
       style="float: right; margin: 0 0 12px 16px; max-width: 40%; height: auto; border-radius: 4px;">
  <p style="color: #495057;">Text wraps on the left side of the image.</p>
  <div style="clear: both;"></div>
</div>`
        },
        {
          name: "Iframe floated left with text",
          html: `<div>
  <iframe src="https://example.com" style="float: left; width: 50%; height: 200px; border: none; margin: 0 16px 12px 0;"></iframe>
  <p style="color: #495057;">Description text wraps beside the embedded content.</p>
  <div style="clear: both;"></div>
</div>`
        }
      ]
    },
    {
      id: "L08",
      category: "Layout",
      name: "Flex Alignment",
      description: "Use flexbox properties to control horizontal and vertical alignment of child elements. Extends L03 with explicit alignment control.",
      variants: [
        {
          name: "Center children horizontally",
          html: `<div style="display: flex; justify-content: center; gap: 16px; flex-wrap: wrap;">
  <div style="padding: 16px; background: #f8f8f8; border: 1px solid #dee2e6; border-radius: 4px;">Centered A</div>
  <div style="padding: 16px; background: #f8f8f8; border: 1px solid #dee2e6; border-radius: 4px;">Centered B</div>
</div>`
        },
        {
          name: "Push children to opposite ends",
          html: `<div style="display: flex; justify-content: space-between; align-items: center;">
  <span style="font-weight: 600; color: #333333;">Left Label</span>
  <span style="color: #6c757d;">Right Value</span>
</div>`
        },
        {
          name: "Right-align children",
          html: `<div style="display: flex; justify-content: flex-end; gap: 12px;">
  <a href="#" style="display: inline-block; padding: 10px 20px; background: #0066cc; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: 600;">Action</a>
</div>`
        },
        {
          name: "Vertically center mixed-height content",
          html: `<div style="display: flex; align-items: center; gap: 12px;">
  <img src="IMAGE_URL" alt="Icon" style="width: 48px; height: 48px; border-radius: 4px;">
  <div>
    <p style="margin: 0; font-weight: 600; color: #333333;">Title</p>
    <p style="margin: 4px 0 0; font-size: 13px; color: #6c757d;">Subtitle text</p>
  </div>
</div>`
        }
      ]
    },
    {
      id: "C01",
      category: "Content",
      name: "Collapsible Section",
      description: "Click to expand/collapse. All sections start closed in Canvas (the open attribute is stripped).",
      variants: [
        {
          name: "Default",
          html: `<details style="margin-bottom: 12px; border: 1px solid #dee2e6; border-radius: 4px;">
  <summary style="padding: 12px 16px; background: #f8f8f8; cursor: pointer; font-weight: 600; color: #333333;">
    SECTION TITLE
  </summary>
  <div style="padding: 16px;">
    SECTION CONTENT
  </div>
</details>`
        }
      ]
    },
    {
      id: "C02",
      category: "Content",
      name: "Nested Collapsibles",
      description: "Multi-level expandable content. Good for outlines and hierarchical information.",
      variants: [
        {
          name: "Default",
          html: `<details style="margin-bottom: 12px; border: 1px solid #dee2e6; border-radius: 4px;">
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
</details>`
        }
      ]
    },
    {
      id: "C03",
      category: "Content",
      name: "Info Card",
      description: "Boxed content block with a header. Use for announcements, key info, resources.",
      variants: [
        {
          name: "Default",
          html: `<div style="border: 1px solid #dee2e6; border-radius: 4px; margin-bottom: 16px; overflow: hidden;">
  <div style="background: #f8f8f8; padding: 12px 16px; font-weight: 600; color: #333333; border-bottom: 1px solid #dee2e6;">
    CARD TITLE
  </div>
  <div style="padding: 16px;">
    CARD CONTENT
  </div>
</div>`
        }
      ]
    },
    {
      id: "C04",
      category: "Content",
      name: "Definition List",
      description: "For term-definition pairs. Good for glossaries, FAQs, key terms.",
      variants: [
        {
          name: "Default",
          html: `<dl style="margin: 0; padding: 0;">
  <dt style="font-weight: 600; color: #333333; margin-top: 12px;">TERM 1</dt>
  <dd style="margin: 4px 0 0 20px; color: #495057;">Definition of term 1.</dd>
  <dt style="font-weight: 600; color: #333333; margin-top: 12px;">TERM 2</dt>
  <dd style="margin: 4px 0 0 20px; color: #495057;">Definition of term 2.</dd>
</dl>`
        }
      ]
    },
    {
      id: "C05",
      category: "Content",
      name: "Styled Definition List with Border Accent",
      description: "Adds a left border for visual emphasis.",
      variants: [
        {
          name: "Default",
          html: `<dl style="margin: 0; padding: 0;">
  <dt style="font-weight: 600; color: #333333; margin-top: 16px; padding-bottom: 4px; border-bottom: 1px solid #dee2e6;">TERM</dt>
  <dd style="margin: 8px 0 0 0; padding-left: 16px; border-left: 3px solid #0066cc; color: #495057;">
    Definition with left border accent for visual hierarchy.
  </dd>
</dl>`
        }
      ]
    },
    {
      id: "C06",
      category: "Content",
      name: "Ordered List Variants",
      description: "Standard numbered, lettered, or roman numeral lists.",
      variants: [
        {
          name: "Numbered (default)",
          html: `<ol style="padding-left: 24px; color: #495057;">
  <li>First item</li>
  <li>Second item</li>
</ol>`
        },
        {
          name: "Lettered",
          html: `<ol type="A" style="padding-left: 24px; color: #495057;">
  <li>Item A</li>
  <li>Item B</li>
</ol>`
        },
        {
          name: "Roman numerals",
          html: `<ol type="i" style="padding-left: 24px; color: #495057;">
  <li>Item i</li>
  <li>Item ii</li>
</ol>`
        },
        {
          name: "Starting at a custom number",
          html: `<ol start="5" style="padding-left: 24px; color: #495057;">
  <li>Fifth item</li>
  <li>Sixth item</li>
</ol>`
        }
      ]
    },
    {
      id: "C07",
      category: "Content",
      name: "Checklist",
      description: "Uses Unicode markers for visual checklists. Not interactive -- purely visual.",
      variants: [
        {
          name: "Default",
          html: `<ul style="list-style: none; padding-left: 8px; color: #495057;">
  <li style="margin-bottom: 6px;">&#9745; Completed task</li>
  <li style="margin-bottom: 6px;">&#9744; Incomplete task</li>
  <li style="margin-bottom: 6px;">&#9744; Another incomplete task</li>
</ul>`
        }
      ]
    },
    {
      id: "C08",
      category: "Content",
      name: "Captioned Code Block",
      description: "Code with a descriptive caption below. Uses <figure> and <figcaption>.",
      variants: [
        {
          name: "Default",
          html: `<figure style="margin: 16px 0;">
  <pre style="background: #f8f8f8; border: 1px solid #dee2e6; border-radius: 4px; padding: 16px; overflow-x: auto; font-family: monospace; font-size: 14px; color: #333333;"><code>function example() {
  return "Canvas-safe code block";
}</code></pre>
  <figcaption style="margin-top: 8px; font-size: 13px; color: #6c757d; font-style: italic;">
    Figure 1: Example code caption
  </figcaption>
</figure>`
        }
      ]
    },
    {
      id: "C09",
      category: "Content",
      name: "Basic Unordered List",
      description: "Styled bullet list for general content. The most common content element.",
      variants: [
        {
          name: "Default",
          html: `<ul style="padding-left: 24px; color: #495057; margin-bottom: 12px;">
  <li style="margin-bottom: 6px;">First item</li>
  <li style="margin-bottom: 6px;">Second item</li>
  <li style="margin-bottom: 6px;">Third item</li>
</ul>`
        },
        {
          name: "Nested",
          html: `<ul style="padding-left: 24px; color: #495057; margin-bottom: 12px;">
  <li style="margin-bottom: 6px;">Main item
    <ul style="padding-left: 20px; margin-top: 6px;">
      <li style="margin-bottom: 4px;">Sub-item A</li>
      <li style="margin-bottom: 4px;">Sub-item B</li>
    </ul>
  </li>
  <li style="margin-bottom: 6px;">Another main item</li>
</ul>`
        }
      ]
    },
    {
      id: "T01",
      category: "Typography",
      name: "Styled Heading",
      description: "Headings with bottom border for section separation.",
      variants: [
        {
          name: "Default",
          html: `<h2 style="color: #333333; font-size: 20px; font-weight: 700; padding-bottom: 8px; border-bottom: 2px solid #0066cc; margin-bottom: 16px; font-family: system-ui, -apple-system, sans-serif;">
  SECTION TITLE
</h2>`
        }
      ]
    },
    {
      id: "T02",
      category: "Typography",
      name: "Highlighted Text",
      description: "Draw attention to key terms or phrases inline.",
      variants: [
        {
          name: "Default",
          html: `<mark style="background-color: #fff3cd; padding: 2px 6px; border-radius: 2px;">highlighted text</mark>`
        },
        {
          name: "Green highlight",
          html: `<mark style="background-color: #d4edda; padding: 2px 6px; border-radius: 2px;">green highlight</mark>`
        },
        {
          name: "Red highlight",
          html: `<mark style="background-color: #f8d7da; padding: 2px 6px; border-radius: 2px;">red highlight</mark>`
        },
        {
          name: "Blue highlight",
          html: `<mark style="background-color: #cce5ff; padding: 2px 6px; border-radius: 2px;">blue highlight</mark>`
        }
      ]
    },
    {
      id: "T03",
      category: "Typography",
      name: "Abbreviation with Tooltip",
      description: "Hover to see full term. Good for jargon, acronyms.",
      variants: [
        {
          name: "Default",
          html: `<abbr title="Rich Content Editor">RCE</abbr>`
        }
      ]
    },
    {
      id: "T04",
      category: "Typography",
      name: "Inserted and Deleted Text",
      description: "Show additions and removals. Useful for revision tracking or changelogs.",
      variants: [
        {
          name: "Default",
          html: `<del style="color: #dc3545; text-decoration: line-through;">removed text</del>
<ins style="color: #28a745; text-decoration: underline;">added text</ins>`
        }
      ]
    },
    {
      id: "T05",
      category: "Typography",
      name: "Keyboard Shortcut",
      description: "Display keyboard keys or terminal commands.",
      variants: [
        {
          name: "Keyboard keys",
          html: `<kbd style="background: #f8f8f8; border: 1px solid #cccccc; border-radius: 3px; padding: 2px 6px; font-family: monospace; font-size: 13px;">Ctrl</kbd> + <kbd style="background: #f8f8f8; border: 1px solid #cccccc; border-radius: 3px; padding: 2px 6px; font-family: monospace; font-size: 13px;">S</kbd>`
        },
        {
          name: "Terminal output",
          html: `<samp style="font-family: monospace; color: #6c757d;">Program exited with code 0</samp>`
        },
        {
          name: "Variable",
          html: `<var style="font-style: italic; color: #0066cc;">x</var>`
        }
      ]
    },
    {
      id: "T06",
      category: "Typography",
      name: "Styled Blockquote",
      description: "Visually distinct quotation or callout.",
      variants: [
        {
          name: "Default",
          html: `<blockquote style="margin: 16px 0; padding: 16px 20px; border-left: 4px solid #0066cc; background: #f8f8f8; color: #495057; font-style: italic; border-radius: 0 4px 4px 0;">
  <p style="margin: 0;">Quote or important statement goes here.</p>
  <footer style="margin-top: 8px; font-size: 13px; color: #6c757d; font-style: normal;">-- Attribution</footer>
</blockquote>`
        }
      ]
    },
    {
      id: "T07",
      category: "Typography",
      name: "Styled Horizontal Rule",
      description: "Visual section divider with customized appearance.",
      variants: [
        {
          name: "Default",
          html: `<hr style="border: none; border-top: 2px solid #dee2e6; margin: 24px 0;">`
        },
        {
          name: "Accent colored",
          html: `<hr style="border: none; border-top: 3px solid #0066cc; margin: 24px 0; max-width: 100px;">`
        }
      ]
    },
    {
      id: "T08",
      category: "Typography",
      name: "Superscript and Subscript",
      description: "For footnotes, chemical formulas, or mathematical notation.",
      variants: [
        {
          name: "Footnote reference",
          html: `<sup style="color: #0066cc; font-size: 11px;">[1]</sup>`
        },
        {
          name: "Chemical formula",
          html: `H<sub>2</sub>O`
        },
        {
          name: "Math",
          html: `x<sup>2</sup> + y<sup>2</sup> = z<sup>2</sup>`
        }
      ]
    },
    {
      id: "T09",
      category: "Typography",
      name: "Text Truncation",
      description: "For long titles or labels that should not wrap. Shows ellipsis when overflowing.",
      variants: [
        {
          name: "Default",
          html: `<div style="max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #495057;">
  This is a very long title that will be truncated with an ellipsis
</div>`
        }
      ]
    },
    {
      id: "T10",
      category: "Typography",
      name: "Text & Content Alignment",
      description: "Set horizontal alignment on any block content — text, headings, images, iframes, or mixed content — by applying text-align on a wrapper div.",
      variants: [
        {
          name: "Center a heading",
          html: `<h2 style="text-align: center; color: #333333;">Centered Heading</h2>`
        },
        {
          name: "Right-align a date or label",
          html: `<p style="text-align: right; color: #6c757d; font-size: 13px;">Updated: January 2025</p>`
        },
        {
          name: "Justify paragraph text",
          html: `<p style="text-align: justify; color: #495057;">This paragraph text will stretch to fill the full width of its container, creating even left and right edges. Useful for formal or print-style layouts.</p>`
        },
        {
          name: "Center an image",
          html: `<div style="text-align: center; margin: 16px 0;">
  <img src="IMAGE_URL" alt="Description" style="max-width: 100%; height: auto; border-radius: 4px;">
</div>`
        },
        {
          name: "Center an iframe / embedded website",
          html: `<div style="text-align: center; margin: 16px 0;">
  <iframe src="https://example.com" style="width: 80%; height: 300px; border: none;"></iframe>
</div>`
        },
        {
          name: "Right-align a button row",
          html: `<div style="text-align: right; margin: 16px 0;">
  <a href="#" style="display: inline-block; padding: 10px 20px; background: #0066cc; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: 600;">Submit</a>
</div>`
        }
      ]
    },
    {
      id: "D01",
      category: "Data",
      name: "Data Table",
      description: "Standard table with header, body, and optional footer.",
      variants: [
        {
          name: "Default",
          html: `<table style="width: 100%; border-collapse: collapse; border: 1px solid #dee2e6;">
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
</table>`
        }
      ]
    },
    {
      id: "D02",
      category: "Data",
      name: "Merged Cell Table",
      description: "Use colspan and rowspan for complex layouts within tables.",
      variants: [
        {
          name: "Default",
          html: `<table style="width: 100%; border-collapse: collapse; border: 1px solid #dee2e6;">
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
</table>`
        }
      ]
    },
    {
      id: "D03",
      category: "Data",
      name: "Column-Styled Table",
      description: "Apply consistent styling to entire columns using <colgroup>.",
      variants: [
        {
          name: "Default",
          html: `<table style="width: 100%; border-collapse: collapse; border: 1px solid #dee2e6;">
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
</table>`
        }
      ]
    },
    {
      id: "D04",
      category: "Data",
      name: "Captioned Table",
      description: "Table with a visible caption/title.",
      variants: [
        {
          name: "Default",
          html: `<table style="width: 100%; border-collapse: collapse; border: 1px solid #dee2e6;">
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
</table>`
        }
      ]
    },
    {
      id: "D05",
      category: "Data",
      name: "Schedule Grid",
      description: "Week-by-week or session-by-session schedule layout. Uses merged cells for multi-day spans.",
      variants: [
        {
          name: "Default",
          html: `<table style="width: 100%; border-collapse: collapse; border: 1px solid #dee2e6;">
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
</table>`
        }
      ]
    },
    {
      id: "D06",
      category: "Data",
      name: "Comparison Table",
      description: "Side-by-side feature or option comparison.",
      variants: [
        {
          name: "Default",
          html: `<table style="width: 100%; border-collapse: collapse; border: 1px solid #dee2e6;">
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
</table>`
        }
      ]
    },
    {
      id: "D07",
      category: "Data",
      name: "Div-Based Progress Bar",
      description: "Visual progress indicator using only divs and inline styles. Replaces <meter> and <progress> which Canvas strips.",
      variants: [
        {
          name: "Default",
          html: `<div style="margin-bottom: 8px; font-size: 13px; color: #495057;">Progress: 65%</div>
<div style="background: #dee2e6; border-radius: 4px; overflow: hidden; height: 20px;">
  <div style="background: #0066cc; height: 100%; width: 65%; border-radius: 4px;"></div>
</div>`
        },
        {
          name: "Multi-bar (grading breakdown)",
          html: `<div style="margin-bottom: 12px;">
  <div style="display: flex; justify-content: space-between; font-size: 13px; color: #495057; margin-bottom: 4px;">
    <span>Participation</span><span>25%</span>
  </div>
  <div style="background: #dee2e6; border-radius: 4px; overflow: hidden; height: 12px;">
    <div style="background: #0066cc; height: 100%; width: 25%; border-radius: 4px;"></div>
  </div>
</div>`
        }
      ]
    },
    {
      id: "V01",
      category: "Visual",
      name: "Left-Border Accent Box",
      description: "Content box with a colored left border for emphasis.",
      variants: [
        {
          name: "Default",
          html: `<div style="border-left: 4px solid #0066cc; padding: 16px; margin: 16px 0; background: #f8f8f8; border-radius: 0 4px 4px 0;">
  <strong style="color: #333333;">NOTE:</strong>
  <span style="color: #495057;"> Important information goes here.</span>
</div>`
        }
      ]
    },
    {
      id: "V02",
      category: "Visual",
      name: "Color-Coded Header",
      description: "Page or section header with a distinctive background color. Use to differentiate page types (lecture vs. lab vs. workshop).",
      variants: [
        {
          name: "Blue header (lectures)",
          html: `<div style="background: #0066cc; color: #ffffff; padding: 16px 20px; margin-bottom: 24px; border-radius: 4px;">
  <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #ffffff;">PAGE TITLE</h1>
  <p style="margin: 8px 0 0; font-size: 14px; color: #cce5ff;">Subtitle or date</p>
</div>`
        },
        {
          name: "Green header (workshops)",
          html: `<div style="background: #28a745; color: #ffffff; padding: 16px 20px; margin-bottom: 24px; border-radius: 4px;">
  <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #ffffff;">WORKSHOP TITLE</h1>
  <p style="margin: 8px 0 0; font-size: 14px; color: #d4edda;">Date or session</p>
</div>`
        },
        {
          name: "Orange header (labs / dev days)",
          html: `<div style="background: #e67e22; color: #ffffff; padding: 16px 20px; margin-bottom: 24px; border-radius: 4px;">
  <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #ffffff;">LAB TITLE</h1>
  <p style="margin: 8px 0 0; font-size: 14px; color: #fdebd0;">Lab number or topic</p>
</div>`
        }
      ]
    },
    {
      id: "V03",
      category: "Visual",
      name: "Alert / Callout Box",
      description: "For warnings, tips, or important notices.",
      variants: [
        {
          name: "Warning",
          html: `<div style="padding: 16px; margin: 16px 0; background: #fff3cd; border: 1px solid #ffc107; border-radius: 4px;">
  <strong style="color: #856404;">&#9888; Warning:</strong>
  <span style="color: #856404;"> Warning message here.</span>
</div>`
        },
        {
          name: "Success / Tip",
          html: `<div style="padding: 16px; margin: 16px 0; background: #d4edda; border: 1px solid #28a745; border-radius: 4px;">
  <strong style="color: #155724;">&#10004; Tip:</strong>
  <span style="color: #155724;"> Helpful tip here.</span>
</div>`
        },
        {
          name: "Danger / Don't",
          html: `<div style="padding: 16px; margin: 16px 0; background: #f8d7da; border: 1px solid #dc3545; border-radius: 4px;">
  <strong style="color: #721c24;">&#10006; Important:</strong>
  <span style="color: #721c24;"> Critical warning here.</span>
</div>`
        },
        {
          name: "Info",
          html: `<div style="padding: 16px; margin: 16px 0; background: #cce5ff; border: 1px solid #0066cc; border-radius: 4px;">
  <strong style="color: #004085;">&#8505; Note:</strong>
  <span style="color: #004085;"> Informational note here.</span>
</div>`
        }
      ]
    },
    {
      id: "V04",
      category: "Visual",
      name: "Status Badge",
      description: "Small label positioned over or beside content. Uses relative/absolute positioning.",
      variants: [
        {
          name: "Default",
          html: `<div style="position: relative; display: inline-block;">
  <span style="position: absolute; top: -8px; right: -8px; background: #dc3545; color: #ffffff; font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 10px;">
    NEW
  </span>
  <div style="padding: 16px; border: 1px solid #dee2e6; border-radius: 4px; margin-top: 8px;">
    Content with a badge
  </div>
</div>`
        },
        {
          name: "Inline badge",
          html: `<span style="display: inline-block; background: #0066cc; color: #ffffff; font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 10px; vertical-align: middle;">
  REQUIRED
</span>`
        }
      ]
    },
    {
      id: "V05",
      category: "Visual",
      name: "Gradient Header",
      description: "Banner with a gradient background. More visually distinct than solid color headers.",
      variants: [
        {
          name: "Default",
          html: `<div style="background: linear-gradient(135deg, #0066cc, #004499); color: #ffffff; padding: 24px 20px; margin-bottom: 24px; border-radius: 4px;">
  <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #ffffff;">PAGE TITLE</h1>
  <p style="margin: 8px 0 0; font-size: 15px; color: #b3d9ff;">Supporting description text</p>
</div>`
        }
      ]
    },
    {
      id: "V06",
      category: "Visual",
      name: "Dark Theme Section",
      description: "A section with dark background. Use for visual contrast or emphasis.",
      variants: [
        {
          name: "Default",
          html: `<div style="background: #1a1a2e; color: #e0e0e0; padding: 24px; margin: 24px 0; border-radius: 4px;">
  <h2 style="color: #ffffff; margin-top: 0;">SECTION TITLE</h2>
  <p style="color: #e0e0e0; margin-bottom: 0;">Content on dark background. <a href="#" style="color: #66ccff;">Links use light blue.</a></p>
</div>`
        }
      ]
    },
    {
      id: "N01",
      category: "Navigation",
      name: "Anchor Link Table of Contents",
      description: "Jump links to sections within the same page. Each target section later in the page needs a matching id, e.g. <h2 id=\"section-1\">Section One</h2>.",
      variants: [
        {
          name: "Default",
          html: `<div style="background: #f8f8f8; border: 1px solid #dee2e6; border-radius: 4px; padding: 16px; margin-bottom: 24px;">
  <h3 style="margin-top: 0; color: #333333;">Contents</h3>
  <ol style="padding-left: 24px; color: #495057;">
    <li><a href="#section-1" style="color: #0066cc;">Section One</a></li>
    <li><a href="#section-2" style="color: #0066cc;">Section Two</a></li>
    <li><a href="#section-3" style="color: #0066cc;">Section Three</a></li>
  </ol>
</div>`
        }
      ]
    },
    {
      id: "N02",
      category: "Navigation",
      name: "Button-Styled Links",
      description: "Links styled as clickable buttons for CTAs or resource links.",
      variants: [
        {
          name: "Default",
          html: `<a href="URL_HERE" style="display: inline-block; padding: 10px 20px; background: #0066cc; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: 600; font-size: 15px;">
  BUTTON TEXT
</a>`
        },
        {
          name: "Secondary",
          html: `<a href="URL_HERE" style="display: inline-block; padding: 10px 20px; background: #ffffff; color: #0066cc; text-decoration: none; border: 2px solid #0066cc; border-radius: 4px; font-weight: 600; font-size: 15px;">
  SECONDARY BUTTON
</a>`
        },
        {
          name: "Button row",
          html: `<div style="display: flex; gap: 12px; flex-wrap: wrap; margin: 16px 0;">
  <a href="URL_1" style="display: inline-block; padding: 10px 20px; background: #0066cc; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: 600;">Button 1</a>
  <a href="URL_2" style="display: inline-block; padding: 10px 20px; background: #28a745; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: 600;">Button 2</a>
  <a href="URL_3" style="display: inline-block; padding: 10px 20px; background: #6c757d; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: 600;">Button 3</a>
</div>`
        }
      ]
    },
    {
      id: "X01",
      category: "Canvas",
      name: "Canvas Assignment Link",
      description: "Link to a Canvas assignment using the API endpoint pattern. Replace COURSE_ID and ASSIGNMENT_ID.",
      variants: [
        {
          name: "Default",
          html: `<a href="/courses/COURSE_ID/assignments/ASSIGNMENT_ID" style="color: #0066cc; font-weight: 600;">
  Assignment Name
</a>`
        }
      ]
    },
    {
      id: "X02",
      category: "Canvas",
      name: "Canvas File Embed",
      description: "Embed an image hosted in Canvas Files. Replace COURSE_ID and FILE_ID. Get the URL from Canvas Files.",
      variants: [
        {
          name: "Default",
          html: `<figure style="margin: 16px 0; text-align: center;">
  <img src="/courses/COURSE_ID/files/FILE_ID/preview" alt="DESCRIPTION" style="max-width: 100%; height: auto; border-radius: 4px;">
  <figcaption style="margin-top: 8px; font-size: 13px; color: #6c757d; font-style: italic;">Caption text</figcaption>
</figure>`
        }
      ]
    },
    {
      id: "X03",
      category: "Canvas",
      name: "Canvas Page Link",
      description: "Link to another Canvas page (wiki page).",
      variants: [
        {
          name: "Default",
          html: `<a href="/courses/COURSE_ID/pages/page-url-slug" style="color: #0066cc;">Page Title</a>`
        }
      ]
    },
    {
      id: "X04",
      category: "Canvas",
      name: "Video Embed (iframe)",
      description: "Embed YouTube, Vimeo, or institutional video (YUJA, Panopto, etc.).",
      variants: [
        {
          name: "Default",
          html: `<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; margin: 16px 0; border-radius: 4px;">
  <iframe src="https://www.youtube.com/embed/VIDEO_ID" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;" allowfullscreen></iframe>
</div>`
        }
      ]
    },
    {
      id: "X05",
      category: "Canvas",
      name: "Audio Player",
      description: "Native HTML5 audio player. Upload audio to Canvas Files first.",
      variants: [
        {
          name: "Default",
          html: `<div style="margin: 16px 0;">
  <p style="font-weight: 600; color: #333333; margin-bottom: 8px;">AUDIO TITLE</p>
  <audio controls style="width: 100%;">
    <source src="/courses/COURSE_ID/files/FILE_ID/preview" type="audio/mpeg">
  </audio>
</div>`
        }
      ]
    },
    {
      id: "X06",
      category: "Canvas",
      name: "Video Player",
      description: "Native HTML5 video player. Upload video to Canvas Files first.",
      variants: [
        {
          name: "Default",
          html: `<div style="margin: 16px 0;">
  <video controls style="max-width: 100%; border-radius: 4px;">
    <source src="/courses/COURSE_ID/files/FILE_ID/preview" type="video/mp4">
  </video>
</div>`
        }
      ]
    },
    {
      id: "E01",
      category: "Media",
      name: "GitHub-Hosted Image",
      description: "Image hosted on faculty's own GitHub Pages site; always build complete absolute URLs from the GITHUB_PAGES_BASE base URL, never relative paths.",
      variants: [
        {
          name: "Default",
          html: `<div style="text-align: center; margin: 16px 0;">
  <img src="GITHUB_PAGES_BASE/images/photo.jpg"
       alt="Descriptive alt text"
       style="max-width: 100%; height: auto; border-radius: 4px;">
  <p style="font-size: 0.85em; color: #666666; margin-top: 6px;">Caption text</p>
</div>`
        }
      ]
    },
    {
      id: "E02",
      category: "Media",
      name: "External Website Embed",
      description: "Embed an external website (p5.js sketch, data visualization, interactive widget) via iframe with an absolute URL, wrapped in a container div with overflow: hidden to crop the visible area.",
      variants: [
        {
          name: "Default",
          html: `<div style="text-align: center; overflow: hidden; height: 200px; margin: 16px 0; border-radius: 4px;">
  <iframe src="https://username.github.io/my-sketch/"
          style="width: 100%; height: 300px; border: none; display: block; margin: 0 auto;"
          scrolling="no"
          frameborder="0"
          allowtransparency="true">
  </iframe>
</div>`
        }
      ]
    },
    {
      id: "E03",
      category: "Media",
      name: "Linked Image",
      description: "GitHub-hosted image wrapped in a link, useful for thumbnails linking to full-size versions; both href and src must be absolute URLs built from the GitHub Pages base URL.",
      variants: [
        {
          name: "Default",
          html: `<div style="text-align: center; margin: 16px 0;">
  <a href="GITHUB_PAGES_BASE/images/full-size.jpg" target="_blank" rel="noopener">
    <img src="GITHUB_PAGES_BASE/images/thumbnail.jpg"
         alt="Click to view full size"
         style="max-width: 100%; height: auto; border-radius: 4px;">
  </a>
</div>`
        }
      ]
    }
  ]
};
