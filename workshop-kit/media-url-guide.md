# Media URL Guide

Canvas pages do not have access to files on your computer. Images and embedded media need URLs Canvas can reach.

## Canvas-Hosted Files

Upload the image, audio, or video to Canvas Files first. Then use the Canvas file URL.

If you do not have the URL during the workshop, use this placeholder:

```text
[CANVAS_IMAGE_URL]
```

Replace it later in Canvas.

## GitHub Pages Images

Use a complete `https://` URL.

Good:

```text
https://username.github.io/course-site/images/example.jpg
```

Not good:

```text
images/example.jpg
```

## External Images

External image URLs must be public and allowed by your institution's Canvas settings.

## Embedded Websites And Sketches

Use the full URL of the page to embed.

Good:

```text
https://username.github.io/my-sketch/
```

Canvas may block some iframe domains. GitHub Pages is often allowed, but this depends on your institution.

## Prompt Pattern For Images

```text
Images are hosted on GitHub Pages. Base URL: https://username.github.io/course-site/images/

Images:
1. intro-photo.jpg - Alt text: Students drawing from a still life setup
2. value-scale.jpg - Alt text: Graphite value scale from light to dark

Build full absolute image URLs from the base URL. Do not use relative paths.
```
