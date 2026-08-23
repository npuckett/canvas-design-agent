#!/usr/bin/env python3
"""Re-sync a repo file from HTML saved out of Canvas (no export needed).

Part of the canvas-design-agent project. Stdlib only. Requires Python 3.9+.

Usage:
    python3 tools/canvas_html_sync.py <saved.html> [--target FILE] [--apply] [--out FILE] [--raw]

Where <saved.html> is either:
  * the fragment from the Canvas editor's `</>` HTML view (Edit -> toggle
    "Switch to raw HTML editor" -> select all -> copy -> paste into a file), or
  * a full page saved from the browser (File -> Save Page As -> "Webpage,
    HTML Only"). The tool finds Canvas's `user_content` container itself.

What it does:
  1. Extracts the content body and strips what Canvas adds on save/display
     (data-api-* attributes, class attributes, external-link icons).
  2. Rewrites Canvas course URLs back into repo link tokens:
       /courses/<id>/pages/<slug>            -> $WIKI_REFERENCE$/pages/<repo-slug>
       /courses/<id>/assignments/syllabus    -> $CANVAS_COURSE_REFERENCE$/assignments/syllabus
       /courses/<id>/assignments/<n>         -> $CANVAS_OBJECT_REFERENCE$/assignments/<stable id>
       /courses/<id>/files/<n>/...           -> $IMS-CC-FILEBASE$/<path under web_resources>
       /courses/<id>/modules|grades|external_tools/... -> $CANVAS_COURSE_REFERENCE$/...
     Numeric assignment/file ids are resolved by link text, `title`/`alt`
     attributes, and the links already in the repo file; anything that can't
     be resolved is left as-is and reported.
  3. Reports a text-level diff (tags stripped) of repo vs Canvas, a link diff,
     and a markup-loss warning when the Canvas copy has fewer inline styles /
     <strong> tags than the repo (the editor strips font-weight, text-transform
     and block-level anchors — see CLAUDE.md rule 10).
  4. With --apply, replaces the body of the target file (front matter kept).
     With --out, writes the cleaned body to a file instead.

The target file is inferred from the HTML file's name (`syllabus.html` ->
syllabus.md, `<slug>.html` -> pages/ or assignments/ by slug or title) or
from the saved page's <title>; pass --target to override.

Default (no --apply) changes nothing on disk: it is safe to run as a check.
"""

from __future__ import annotations

import argparse
import difflib
import html
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from build_imscc import parse_front_matter, slugify, stable_id  # noqa: E402

COURSE_URL = re.compile(r"(?:https?://[^/\"'\s]+)?/courses/(\d+)(/[^\"'\s]*)?")
BLOCK_TAGS = r"p|div|li|ul|ol|h[1-6]|tr|table|thead|tbody|tfoot|blockquote|section|article|header|footer|pre|dt|dd|dl|figure|figcaption|br|hr"


# ---------------------------------------------------------------------------
# Repo lookup
# ---------------------------------------------------------------------------

def load_repo(root: Path) -> dict:
    course_fm, _ = parse_front_matter((root / "course.md").read_text(encoding="utf-8"))
    course_code = course_fm.get("course_code", "")
    info = {"course_code": course_code, "course_title": course_fm.get("title", ""),
            "pages": {}, "assignments": {}, "files": {}}
    for path in sorted((root / "pages").glob("*.md")) if (root / "pages").is_dir() else []:
        fm, _ = parse_front_matter(path.read_text(encoding="utf-8"))
        title = fm.get("title") or path.stem
        slug = slugify(path.stem)
        info["pages"][slug] = {"path": path, "title": title, "canvas_slug": slugify(title)}
    for path in sorted((root / "assignments").glob("*.md")) if (root / "assignments").is_dir() else []:
        fm, _ = parse_front_matter(path.read_text(encoding="utf-8"))
        title = fm.get("title") or path.stem
        slug = slugify(path.stem)
        info["assignments"][slug] = {"path": path, "title": title,
                                     "identifier": stable_id(course_code, "assignment", slug)}
    web = root / "web_resources"
    if web.is_dir():
        for path in sorted(web.rglob("*")):
            if path.is_file():
                info["files"].setdefault(path.name.lower(), path.relative_to(web).as_posix())
    return info


def resolve_target(html_path: Path, explicit: str | None, doc_title: str, repo: dict, root: Path,
                   course_title: str = "") -> Path:
    if explicit:
        return (root / explicit) if not Path(explicit).is_absolute() else Path(explicit)
    stem = slugify(html_path.stem)
    if stem in ("syllabus", "course-syllabus"):
        return root / "syllabus.md"
    for kind in ("pages", "assignments"):
        for slug, item in repo[kind].items():
            if stem in (slug, slugify(item["title"]), item.get("canvas_slug")):
                return item["path"]
    # Fall back on the saved page's <title> ("Page Title: Course Name"), then
    # on each repo page's own <h1> (front pages are often titled differently
    # from their visible heading).
    candidates = [stem]
    if doc_title:
        # Canvas titles are "<Item title>: <Course title>"; item titles may
        # themselves contain colons, so strip the course title first.
        rest = doc_title
        if course_title and rest.lower().endswith(course_title.lower()):
            rest = rest[: -len(course_title)].rstrip(" :")
        candidates += [slugify(rest), slugify(doc_title.split(":")[0])]
    for head in candidates:
        if head.startswith("course-syllabus") or head.startswith("syllabus"):
            return root / "syllabus.md"
        for kind in ("pages", "assignments"):
            for slug, item in repo[kind].items():
                if head in (slug, slugify(item["title"])):
                    return item["path"]
                _, body = parse_front_matter(item["path"].read_text(encoding="utf-8"))
                h1 = re.search(r"<h1\b[^>]*>(.*?)</h1>", body, re.DOTALL | re.IGNORECASE)
                if h1 and head == slugify(norm_text(h1.group(1))):
                    return item["path"]
    sys.exit(f"error: cannot infer which repo file {html_path.name} belongs to; pass --target "
             f"(e.g. --target syllabus.md or --target pages/home.md)")


# ---------------------------------------------------------------------------
# Extraction and cleaning
# ---------------------------------------------------------------------------

def extract_body(text: str) -> tuple[str, str]:
    """Return (content fragment, document title). Accepts fragments or full pages."""
    title_match = re.search(r"<title>(.*?)</title>", text, re.DOTALL | re.IGNORECASE)
    doc_title = html.unescape(title_match.group(1)).strip() if title_match else ""
    if not re.search(r"<body[\s>]", text, re.IGNORECASE):
        return text.strip(), doc_title
    # Canvas renders syllabus/page/assignment bodies inside a div with class
    # user_content (the syllabus one also has id="course_syllabus").
    start = None
    for match in re.finditer(r"<div\b[^>]*>", text, re.IGNORECASE):
        tag = match.group(0)
        if 'id="course_syllabus"' in tag or re.search(r'class="[^"]*\buser_content\b', tag):
            start = match
            break
    if start is None:
        sys.exit("error: full HTML page given but no Canvas content container (user_content) found")
    depth = 0
    for match in re.finditer(r"<div\b[^>]*>|</div\s*>", text[start.start():], re.IGNORECASE):
        depth += 1 if match.group(0).lower().startswith("<div") else -1
        if depth == 0:
            inner = text[start.end(): start.start() + match.start()]
            return inner.strip(), doc_title
    sys.exit("error: unbalanced <div> tags in saved page")


def clean(fragment: str) -> str:
    # Display-only decorations Canvas injects around external links.
    fragment = re.sub(r'<span class="external_link_icon".*?Links to an external site\.</span>\s*</span>',
                      "", fragment, flags=re.DOTALL)
    fragment = re.sub(r'<span class="screenreader-only">.*?</span>', "", fragment, flags=re.DOTALL)
    # Attributes the editor/API stamps onto links and images.
    fragment = re.sub(r'\s+(?:data-api-endpoint|data-api-returntype|data-course-type|data-published'
                      r'|data-canvas-previewable|data-preview-alt|data-mce-[a-z-]+|data-id|data-uuid'
                      r'|loading|class)="[^"]*"', "", fragment)
    # <a ...><span>text</span></a> wrappers from rendered external links.
    fragment = re.sub(r"(<a\b[^>]*>)<span>([^<]*)</span>(</a>)", r"\1\2\3", fragment)
    return fragment.strip()


# ---------------------------------------------------------------------------
# Link rewriting
# ---------------------------------------------------------------------------

def link_text_map(body: str) -> dict[str, str]:
    """Map visible link text -> href for every token link already in a repo body."""
    out: dict[str, str] = {}
    for match in re.finditer(r"<a\b[^>]*href=\"(\$[^\"]+)\"[^>]*>(.*?)</a>", body, re.DOTALL | re.IGNORECASE):
        text = norm_text(match.group(2))
        if text:
            out.setdefault(text, match.group(1))
    return out


def norm_text(fragment: str) -> str:
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", fragment))).strip()


def rewrite_links(fragment: str, repo: dict, repo_body: str, report: list[str]) -> str:
    by_text = link_text_map(repo_body)
    canvas_pages = {p["canvas_slug"]: slug for slug, p in repo["pages"].items()}
    assignment_by_title = {slugify(a["title"]): a["identifier"] for a in repo["assignments"].values()}
    course_ids: set[str] = set()

    def map_url(url: str, text: str, hint: str) -> str | None:
        m = COURSE_URL.fullmatch(url)
        if not m:
            return None
        course_ids.add(m.group(1))
        path = (m.group(2) or "").split("?")[0].split("#")[0].rstrip("/")
        parts = path.strip("/").split("/") if path else []
        if not parts:
            return "$CANVAS_COURSE_REFERENCE$"
        kind = parts[0]
        if kind == "pages" and len(parts) >= 2:
            slug = parts[1]
            if slug in repo["pages"]:
                return f"$WIKI_REFERENCE$/pages/{slug}"
            if slug in canvas_pages:
                return f"$WIKI_REFERENCE$/pages/{canvas_pages[slug]}"
            report.append(f"  ! page link kept by Canvas slug (no repo page matches): {slug}")
            return f"$WIKI_REFERENCE$/pages/{slug}"
        if kind == "assignments":
            if len(parts) == 1:
                return "$CANVAS_COURSE_REFERENCE$/assignments"
            if parts[1] == "syllabus":
                return "$CANVAS_COURSE_REFERENCE$/assignments/syllabus"
            if parts[1].isdigit():
                for key in (slugify(hint), slugify(text)):
                    if key and key in assignment_by_title:
                        return f"$CANVAS_OBJECT_REFERENCE$/assignments/{assignment_by_title[key]}"
                if text in by_text and "/assignments/" in by_text[text]:
                    return by_text[text]
                report.append(f"  ! unresolved assignment link left as-is: {url} ({text or hint or 'no text'})")
                return None
        if kind == "files" and len(parts) >= 2 and parts[1].isdigit():
            for key in (hint, text):
                name = Path(key).name.lower() if key else ""
                if name in repo["files"]:
                    return f"$IMS-CC-FILEBASE$/{repo['files'][name]}"
            if text in by_text and "$IMS-CC-FILEBASE$" in by_text[text]:
                return by_text[text]
            report.append(f"  ! unresolved file link left as-is: {url} ({text or hint or 'no text'})")
            return None
        if kind in ("modules", "grades", "announcements", "discussion_topics", "external_tools",
                    "quizzes", "users", "files", "collaborations", "conferences", "wiki"):
            return "$CANVAS_COURSE_REFERENCE$/" + "/".join(parts)
        report.append(f"  ! unrecognised course URL left as-is: {url}")
        return None

    def sub_anchor(match: re.Match) -> str:
        open_tag, inner, close = match.group(1), match.group(2), match.group(3)
        href = re.search(r'href="([^"]*)"', open_tag)
        if not href:
            return match.group(0)
        title = re.search(r'title="([^"]*)"', open_tag)
        new = map_url(href.group(1), norm_text(inner), html.unescape(title.group(1)) if title else "")
        if new is None:
            return match.group(0)
        return open_tag.replace(href.group(0), f'href="{new}"') + inner + close

    fragment = re.sub(r"(<a\b[^>]*>)(.*?)(</a>)", sub_anchor, fragment, flags=re.DOTALL | re.IGNORECASE)

    def sub_img(match: re.Match) -> str:
        tag = match.group(0)
        src = re.search(r'src="([^"]*)"', tag)
        if not src:
            return tag
        alt = re.search(r'alt="([^"]*)"', tag)
        title = re.search(r'title="([^"]*)"', tag)
        hint = html.unescape((alt or title).group(1)) if (alt or title) else ""
        new = map_url(src.group(1), "", hint)
        if new is None:
            return tag
        return tag.replace(src.group(0), f'src="{new}"')

    fragment = re.sub(r"<img\b[^>]*>", sub_img, fragment, flags=re.IGNORECASE)
    if course_ids:
        report.insert(0, f"  canvas course id seen in links: {', '.join(sorted(course_ids))}")
    return fragment


def assignment_meta(page_html: str) -> dict[str, str]:
    """Best-effort read of points / due / submission type from a saved assignment page."""
    if not re.search(r"<body[\s>]", page_html, re.IGNORECASE):
        return {}
    text = "\n".join(text_lines(page_html))
    out: dict[str, str] = {}
    m = re.search(r"\bPoints\s*\n?\s*(\d+(?:\.\d+)?)", text)
    if m:
        out["points"] = m.group(1)
    m = re.search(r"\bDue\s*\n?\s*([A-Z][a-z]{2}[^\n]*?\d{1,2}(?::\d{2})?\s*[ap]m|No Due Date)", text)
    if m:
        out["due"] = m.group(1).strip()
    m = re.search(r"\bSubmitting\s*\n?\s*([^\n]+)", text)
    if m:
        out["submitting"] = m.group(1).strip()
    return out


# ---------------------------------------------------------------------------
# Comparison
# ---------------------------------------------------------------------------

def text_lines(fragment: str) -> list[str]:
    # Only block-level tags break lines; source newlines are whitespace
    # (Canvas re-wraps long paragraphs at ~110 columns when it saves).
    text = re.sub(rf"<(?:/?(?:{BLOCK_TAGS}))\b[^>]*>", "\x00", fragment, flags=re.IGNORECASE)
    text = re.sub(r"<[^>]+>", "", text)
    text = html.unescape(text).replace("\xa0", " ")
    lines = [re.sub(r"\s+", " ", line).strip() for line in text.split("\x00")]
    return [line for line in lines if line]


def links(fragment: str) -> list[tuple[str, str]]:
    out = []
    for match in re.finditer(r"<a\b[^>]*href=\"([^\"]*)\"[^>]*>(.*?)</a>", fragment, re.DOTALL | re.IGNORECASE):
        out.append((norm_text(match.group(2)), match.group(1)))
    return out


def markup_stats(fragment: str) -> dict[str, int]:
    return {
        "style attributes": len(re.findall(r'\sstyle="', fragment)),
        "<strong>": len(re.findall(r"<strong\b", fragment, re.IGNORECASE)),
        "font-weight": len(re.findall(r"font-weight", fragment)),
        "text-transform": len(re.findall(r"text-transform", fragment)),
        "<a> tags": len(re.findall(r"<a\b", fragment, re.IGNORECASE)),
        "<img> tags": len(re.findall(r"<img\b", fragment, re.IGNORECASE)),
    }


def compare(repo_body: str, canvas_body: str, raw: bool) -> bool:
    """Print the report. Returns True if the text or links differ."""
    repo_lines, canvas_lines = text_lines(repo_body), text_lines(canvas_body)
    diff = list(difflib.unified_diff(repo_lines, canvas_lines, "repo", "canvas", lineterm="", n=1))
    repo_links, canvas_links = links(repo_body), links(canvas_body)
    added = [l for l in canvas_links if l not in repo_links]
    removed = [l for l in repo_links if l not in canvas_links]

    print("\n== Text diff (tags stripped; - repo, + canvas) ==")
    if diff:
        print("\n".join(diff[2:]))
    else:
        print("  (no wording changes)")

    print("\n== Link diff ==")
    if not added and not removed:
        print("  (links identical)")
    for text, href in removed:
        print(f"  - [{text}] {href}")
    for text, href in added:
        print(f"  + [{text}] {href}")

    print("\n== Markup ==")
    rs, cs = markup_stats(repo_body), markup_stats(canvas_body)
    lost = [(k, rs[k], cs[k]) for k in rs if cs[k] < rs[k]]
    for k in rs:
        print(f"  {k:>18}: repo {rs[k]:>4}   canvas {cs[k]:>4}")
    if "<!-- PLACEHOLDER -->" in repo_body:
        print("  The repo file is a placeholder: if Canvas now holds the real content,\n"
              "  --apply is the right move (the PLACEHOLDER marker is dropped).")
    elif lost:
        print("  WARNING: the Canvas copy has less markup than the repo (editor save strips\n"
              "  font-weight/text-transform/block anchors). Prefer carrying the wording\n"
              "  changes above into the repo file by hand over --apply, unless the repo\n"
              "  file is plain text anyway.")
    if raw:
        print("\n== Raw HTML diff ==")
        print("\n".join(difflib.unified_diff(repo_body.splitlines(), canvas_body.splitlines(),
                                             "repo", "canvas", lineterm="")))
    return bool(diff or added or removed)


# ---------------------------------------------------------------------------

def main() -> None:
    parser = argparse.ArgumentParser(description="Re-sync a repo file from HTML saved out of Canvas.")
    parser.add_argument("html", type=Path, help="fragment from the RCE HTML view, or a saved full page")
    parser.add_argument("--target", help="repo file to compare/update (inferred from the file name if omitted)")
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parent.parent,
                        help="course folder (default: repo root)")
    parser.add_argument("--apply", action="store_true", help="replace the target's body with the cleaned Canvas body")
    parser.add_argument("--out", type=Path, help="write the cleaned Canvas body to this file instead")
    parser.add_argument("--raw", action="store_true", help="also print a raw HTML diff")
    args = parser.parse_args()

    root = args.root.resolve()
    repo = load_repo(root)
    raw_html = args.html.read_text(encoding="utf-8")
    fragment, doc_title = extract_body(raw_html)
    target = resolve_target(args.html, args.target, doc_title, repo, root, repo["course_title"])
    if not target.exists():
        sys.exit(f"error: target {target} does not exist")
    fm_text = target.read_text(encoding="utf-8")
    fm, repo_body = parse_front_matter(fm_text)

    notes: list[str] = []
    canvas_body = rewrite_links(clean(fragment), repo, repo_body, notes)
    meta = assignment_meta(raw_html) if target.parent.name == "assignments" else {}

    print(f"source : {args.html}")
    print(f"target : {target.relative_to(root) if target.is_relative_to(root) else target}")
    if notes:
        print("\n== Link rewriting ==")
        print("\n".join(notes))
    changed = compare(repo_body, canvas_body, args.raw)
    if meta:
        print("\n== Assignment settings shown on the Canvas page (not part of the HTML body) ==")
        for key, value in meta.items():
            mine = fm.get({"points": "points", "due": "due", "submitting": "submission_types"}[key], "")
            print(f"  {key:>10}: canvas {value!r:<40} repo front matter {mine!r}")
        print("  Points/due/submission type live in front matter; update them there if Canvas differs.")

    if args.out:
        args.out.write_text(canvas_body + "\n", encoding="utf-8")
        print(f"\nwrote cleaned body: {args.out}")
    if args.apply:
        head = ""
        if fm_text.startswith("---"):
            end = fm_text.find("\n---", 3)
            head = fm_text[: end + 4].rstrip("\n") + "\n\n"
        target.write_text(head + canvas_body + "\n", encoding="utf-8")
        print(f"\napplied: {target} body replaced (front matter kept). Rebuild with: python3 tools/build_imscc.py .")
    elif changed and not args.out:
        print("\nNo files changed. Re-run with --apply to take the Canvas body, or --out FILE to save it for hand-merging.")
    elif not changed:
        print("\nIn sync: no wording or link differences.")


if __name__ == "__main__":
    main()
