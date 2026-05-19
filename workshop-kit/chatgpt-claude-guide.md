# ChatGPT And Claude Guide

ChatGPT and Claude can be used as alternatives to Microsoft Copilot when participants have access.

## Basic Steps

1. Start a new chat.
2. Upload `SKILL.md`. If upload is not available, paste the contents of `SKILL.md` into the chat.
3. Tell the AI to treat the skill as the active instruction set for this conversation.
4. Paste your course content.
5. Ask for a Canvas-ready HTML fragment.
6. Copy the HTML into the Canvas HTML editor view.

## Starter Message

```text
Use the uploaded SKILL.md file as the instruction set for this conversation. Generate Canvas LMS-compatible HTML that can be pasted into the Canvas Rich Content Editor HTML view. Use only inline styles and Canvas-safe HTML.
```

## If The Tool Adds Markdown Fences

Some tools wrap code in triple backticks. Canvas does not need those. Ask:

```text
Remove the markdown code fence. Give me only the HTML fragment I should paste into Canvas.
```

## If The Tool Creates A Full HTML Page

Ask:

```text
Canvas needs an HTML fragment only. Remove html, head, body, style, and script tags. Keep only the content that belongs inside the Canvas page editor.
```
