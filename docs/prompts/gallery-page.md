# Gallery Page with External Media

Transform this into a Canvas page using the Canvas Design Agent skill.
Use S05 Studio Dark as the base theme. The embedded p5.js sketch at https://npuckett.github.io/thesisBanner/ is a style reference for the dark, creative mood, but use the concrete S05 colors and Canvas-safe elements from the skill.

## Style

- Layout: single column, centered (L05)
- Section headings: T01
- Images: hosted on GitHub Pages, loaded by absolute URL (E01, E03)
- Website embed: iframe from GitHub Pages (E02)

## Accessibility

- Provide descriptive alt text for every image
- Use descriptive link text for full-size image links
- Keep the page readable on dark backgrounds
- Include fallback text or context around iframe embeds

## Output Expectations

- Output a Canvas HTML fragment only
- Use inline styles only
- Do not include html, head, body, style, script, SVG, or markdown code fences

## Page Info

Course: ART 3090 Digital Studio
Page title: Student Work Gallery - Week 8

## Banner (E02)

Embed this p5.js sketch as a banner across the top of the page. Crop it to about 200px tall so only the animation is visible, no scrollbars.

Website URL: https://npuckett.github.io/thesisBanner/

## Introduction (T01)

This week's gallery features selected student projects exploring generative form. Each piece uses code as a creative medium, translating algorithms into visual expression. Click any thumbnail to view the full-resolution image.

## Student Work (L03 + E03)

Display these as a two-column grid of images with student names underneath. All images are hosted on GitHub Pages. Build full absolute image URLs from the base URL and filenames; do not use relative paths.

Image base URL: https://npuckett.github.io/digital-studio/gallery/week8/

1. Maria Chen — maria-chen-flow.jpg — "Flow State"
2. James Wright — james-wright-grid.jpg — "Grid Memory"
3. Aisha Patel — aisha-patel-noise.jpg — "Noise Field"
4. Tom Okafor — tom-okafor-spiral.jpg — "Recursive Spiral"

Each image should link to its full-size version when clicked.

## Resources (C01)

Add a collapsible section at the bottom with these links:
- p5.js Reference: https://p5js.org/reference/
- Course GitHub Org: https://github.com/digital-studio-art3090
- Submit your work (link to Canvas assignment): Assignment 8 - Generative Art
