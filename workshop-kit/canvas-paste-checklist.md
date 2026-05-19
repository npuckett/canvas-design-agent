# Canvas Paste Checklist

Use this checklist before and after pasting generated HTML into Canvas.

## Before You Paste

- The AI output is HTML, not a screenshot or document.
- The output does not include triple backticks.
- The output does not include `<html>`, `<head>`, or `<body>` tags.
- The output does not include `<style>` or `<script>` tags.
- Images, if any, use full URLs or clear placeholders such as `[CANVAS_IMAGE_URL]`.
- Important instructions are visible, not hidden inside a collapsed section.

## How To Paste

1. Open the Canvas page.
2. Click Edit.
3. Open the HTML editor view. Look for `</>` in the toolbar or the more-options menu.
4. Paste the generated HTML.
5. Save the page.

## After You Save

- Formatting is still visible after saving.
- Text is readable.
- Links work.
- Images load, or placeholders are easy to find.
- Tables are readable.
- Collapsible sections open when clicked.
- The page still works when the browser window is narrow.

## If Something Looks Wrong

Copy the problem section back into the AI chat and ask:

```text
This did not work correctly in Canvas after saving. Please revise it using only Canvas-safe HTML with inline styles. Remove any unsupported tags or CSS. Output only the corrected HTML fragment.
```
