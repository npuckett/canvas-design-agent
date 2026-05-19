# Sample Output Review Checklist

You do not need to understand all the HTML. Use this quick scan before pasting into Canvas.

## Look For Good Signs

- The output starts with normal page content such as `<div>` or `<h1>`.
- You see `style="..."` on many elements.
- There is one main page title.
- Tables have headers when they show schedule, rubric, or grading data.
- Links have meaningful text, not only "click here."
- Images have `alt="..."` text.

## Watch For Problems

- Triple backticks before or after the HTML.
- `<html>`, `<head>`, or `<body>` tags.
- `<style>` or `<script>` tags.
- `box-shadow`, `text-shadow`, `opacity`, or `transform` in the styles.
- Image paths like `photo.jpg` or `images/photo.jpg` instead of full URLs.
- Important deadlines hidden inside collapsed sections.

## Follow-Up Prompt

If you see a problem, ask:

```text
Please revise this for Canvas. Output only an HTML fragment with inline styles. Remove markdown fences, html/head/body tags, style tags, script tags, unsupported CSS, and relative image paths.
```
