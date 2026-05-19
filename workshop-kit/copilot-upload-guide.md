# Microsoft Copilot Upload Guide

Microsoft Copilot is the recommended workshop tool when it is supported by your organization.

## Recommended Path: Attach The Skill File

1. Open the approved Microsoft Copilot experience for your institution.
2. Start a new chat.
3. Attach `SKILL.md` from this folder.
4. Send this message:

```text
Please use the attached SKILL.md file as the instruction set for this conversation. I will paste course content next. Transform it into Canvas LMS-ready HTML that can be pasted into the Canvas Rich Content Editor HTML view.
```

5. Paste your course content.
6. Add the starter request from `participant-start-here.md` or one of the prompts in `starter-prompts.md`.

## Fallback Path: Paste The Skill Text

If file upload is unavailable:

1. Open `SKILL.md`.
2. Select all text and copy it.
3. Paste it into Copilot with this note above it:

```text
The text below is a Canvas HTML generation skill. Treat it as the instruction set for this conversation. After you read it, I will paste course content and ask you to generate Canvas-ready HTML.
```

4. Send that message.
5. Paste your course content in a new message.

## If Copilot Says The File Is Too Long

Try these in order:

1. Start a new chat and attach the file instead of pasting it.
2. If upload is not available, paste the top instruction sections of `SKILL.md` plus the element sections you need.
3. Use a simpler request, such as: "Use inline styles only. No style tags, scripts, SVG, html, head, or body tags. Generate a Canvas-ready HTML fragment."

## Ask For A Clean Output

If the output is hard to copy, send this follow-up:

```text
Please provide only the Canvas HTML fragment. Do not include markdown fences, explanation, html tags, head tags, or body tags.
```
