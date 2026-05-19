# Troubleshooting

## The AI Did Not Use The Skill

Start a new chat. Upload or paste `SKILL.md` again. Say:

```text
Use the attached SKILL.md as the instruction set for this conversation. Follow its Canvas constraints exactly.
```

## The Output Has Backticks Around It

Ask:

```text
Remove the markdown code fence. Give me only the HTML fragment to paste into Canvas.
```

## Canvas Removed The Formatting

The output probably used unsupported CSS or a `<style>` block. Ask:

```text
Regenerate this using inline styles only. Do not use style tags, script tags, SVG, classes for styling, box-shadow, text-shadow, opacity, transform, or external CSS.
```

## The AI Generated A Full Web Page

Ask:

```text
Canvas needs only an HTML fragment. Remove html, head, body, title, meta, style, and script tags.
```

## Images Are Broken

Canvas cannot use local file paths like `images/photo.jpg`.

Use one of these instead:

- A Canvas file URL
- A full GitHub Pages URL such as `https://username.github.io/repo/images/photo.jpg`
- A public `https://` image URL allowed by your Canvas institution

## Embedded Media Does Not Show

Your institution may block that iframe domain. Try a GitHub Pages URL, YouTube/Vimeo embed, or ask your Canvas admin which domains are allowed.

## Collapsible Sections Start Closed

That is expected. Canvas strips the `open` attribute. Put critical information outside collapsible sections.

## The Page Looks Crowded On Mobile

Ask the AI to simplify the layout:

```text
Revise this for mobile readability. Prefer a single-column layout, avoid fixed-width columns, and keep tables simple.
```
