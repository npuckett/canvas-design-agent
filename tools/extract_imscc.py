#!/usr/bin/env python3
"""Extract a Canvas course export (.imscc) into an editable course source folder.

Part of the canvas-design-agent project. Stdlib only. Requires Python 3.9+.

Usage:
    python3 extract_imscc.py <export.imscc> [-o output-folder] [--include-media]

Produces the folder layout that build_imscc.py consumes:

    course.md, groups.md, syllabus.md, modules.md,
    assignments/*.md, pages/*.md, rubrics/*.md,
    web_resources/ (only with --include-media)

Rubrics come out as one .md file per rubric with an explicit rating-points
column per rating label, so criterion points survive the round trip exactly.
Assignments that had a rubric attached get a `rubric:` front matter key.

Datetimes are written as explicit UTC (e.g. `due: 2025-09-18T03:59:59Z`),
which build_imscc.py accepts as-is. Edit them freely into local formats.

Typical workflow for updating an existing course in bulk:
    1. Canvas -> Settings -> Export Course Content -> download the .imscc
    2. python3 extract_imscc.py export.imscc -o my-course
    3. Edit the markdown files (or have an AI agent regenerate them)
    4. python3 build_imscc.py my-course
    5. Canvas -> Settings -> Import Course Content

Note: identifiers are NOT preserved from the original export (build_imscc.py
derives its own stable ids), so the first re-import creates fresh copies of
the content rather than overwriting the originals. Subsequent re-imports of
rebuilt packages DO update in place. Internal wiki links that used
$WIKI_REFERENCE$/pages/<original-id> are rewritten to page slugs so they
survive the round trip.
"""

from __future__ import annotations

import argparse
import re
import sys
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET

CC = "{http://canvas.instructure.com/xsd/cccv1p0}"
IMS = "{http://www.imsglobal.org/xsd/imsccv1p1/imscp_v1p1}"


def text_of(element, tag: str, default: str = "") -> str:
    node = element.find(f"{CC}{tag}")
    return (node.text or "").strip() if node is not None and node.text else default


def body_of(html: str) -> str:
    match = re.search(r"<body[^>]*>(.*)</body>", html, re.DOTALL | re.IGNORECASE)
    return match.group(1).strip() if match else html.strip()


def meta_of(html: str, name: str) -> str:
    match = re.search(rf'<meta name="{name}" content="([^"]*)"', html)
    return match.group(1) if match else ""


def title_of(html: str) -> str:
    match = re.search(r"<title>(.*?)</title>", html, re.DOTALL)
    return match.group(1).strip() if match else ""


def slugify(name: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")
    return slug or "item"


def table_cell(text: str) -> str:
    """Make text safe inside a markdown table cell (build_imscc.py splits on |)."""
    return text.replace("|", "&#124;").replace("\n", " ").strip()


def front_matter(pairs: list[tuple[str, str]]) -> str:
    lines = ["---"]
    for key, value in pairs:
        if value not in ("", None):
            lines.append(f"{key}: {value}")
    lines.append("---")
    return "\n".join(lines)


def utc_z(value: str) -> str:
    return f"{value}Z" if value else ""


def extract(package: Path, out: Path, include_media: bool) -> None:
    zf = zipfile.ZipFile(package)
    names = set(zf.namelist())

    def read(name: str) -> str:
        return zf.read(name).decode("utf-8", errors="replace")

    if "imsmanifest.xml" not in names:
        sys.exit("error: no imsmanifest.xml — not an IMSCC package")
    if "course_settings/course_settings.xml" not in names:
        sys.exit("error: no course_settings/course_settings.xml — not a Canvas course export "
                 "(plain Common Cartridge packages are not supported)")

    out.mkdir(parents=True, exist_ok=True)

    # --- course.md ---------------------------------------------------------
    settings = ET.fromstring(read("course_settings/course_settings.xml"))
    title = text_of(settings, "title", package.stem)
    course_code = text_of(settings, "course_code", "COURSE")
    (out / "course.md").write_text(front_matter([
        ("title", title),
        ("course_code", course_code),
        ("timezone", "UTC"),
    ]) + "\n\n<!-- timezone: dates below are UTC (Z suffix). Set an IANA timezone\n"
        "     (e.g. America/Toronto) and rewrite dates in local time if preferred. -->\n",
        encoding="utf-8")

    # --- groups.md ---------------------------------------------------------
    group_titles: dict[str, str] = {}
    if "course_settings/assignment_groups.xml" in names:
        groups_root = ET.fromstring(read("course_settings/assignment_groups.xml"))
        rows = []
        for g in groups_root.findall(f"{CC}assignmentGroup"):
            g_title = text_of(g, "title")
            group_titles[g.get("identifier", "")] = g_title
            weight = text_of(g, "group_weight")
            drop = ""
            rule = g.find(f"{CC}rules/{CC}rule")
            if rule is not None and text_of(rule, "drop_type") == "drop_lowest":
                drop = text_of(rule, "drop_count")
            rows.append((g_title, weight, drop))
        if rows:
            lines = ["| Group | Weight | Drop Lowest |", "|---|---|---|"]
            lines += [f"| {t} | {w} | {d} |" for t, w, d in rows]
            (out / "groups.md").write_text("\n".join(lines) + "\n", encoding="utf-8")

    # --- rubrics -----------------------------------------------------------
    id_to_rubric_slug: dict[str, str] = {}
    if "course_settings/rubrics.xml" in names:
        rubrics_root = ET.fromstring(read("course_settings/rubrics.xml"))
        rubrics_dir = out / "rubrics"
        for rubric in rubrics_root.findall(f"{CC}rubric"):
            r_title = text_of(rubric, "title", "rubric")
            slug = slugify(r_title)
            while slug in id_to_rubric_slug.values():
                slug += "-2"
            id_to_rubric_slug[rubric.get("identifier", slug)] = slug

            criteria = rubric.findall(f"{CC}criteria/{CC}criterion")
            # Rating labels can vary per criterion in Canvas; the markdown
            # format shares one label set per rubric, so use the first
            # criterion's labels as column headers (points stay exact).
            labels = [text_of(rt, "description") for rt in
                      criteria[0].findall(f"{CC}ratings/{CC}rating")] if criteria else []
            lines = ["| Criterion | Points | Description |" + "".join(f" {table_cell(l)} |" for l in labels),
                     "|---|---|---|" + "---|" * len(labels)]
            for criterion in criteria:
                ratings = criterion.findall(f"{CC}ratings/{CC}rating")
                points = [text_of(rt, "points") for rt in ratings[:len(labels)]]
                points += [""] * (len(labels) - len(points))
                lines.append(f"| {table_cell(text_of(criterion, 'description'))} "
                             f"| {text_of(criterion, 'points')} "
                             f"| {table_cell(text_of(criterion, 'long_description'))} |"
                             + "".join(f" {p} |" for p in points))

            pairs = [("title", r_title)]
            if text_of(rubric, "free_form_criterion_comments") == "true":
                pairs.append(("free_form_comments", "true"))
            if text_of(rubric, "hide_score_total") == "true":
                pairs.append(("hide_score_total", "true"))
            if criteria and text_of(criteria[0], "criterion_use_range") == "false":
                pairs.append(("use_range", "false"))
            rubrics_dir.mkdir(exist_ok=True)
            (rubrics_dir / f"{slug}.md").write_text(
                front_matter(pairs) + "\n\n" + "\n".join(lines) + "\n", encoding="utf-8")

    # --- syllabus.md -------------------------------------------------------
    if "course_settings/syllabus.html" in names:
        (out / "syllabus.md").write_text(
            "---\n---\n" + body_of(read("course_settings/syllabus.html")) + "\n", encoding="utf-8")

    # --- pages -------------------------------------------------------------
    pages_dir = out / "pages"
    id_to_page_slug: dict[str, str] = {}
    page_names = sorted(n for n in names if n.startswith("wiki_content/") and n.endswith(".html"))
    if page_names:
        pages_dir.mkdir(exist_ok=True)
    for name in page_names:
        html = read(name)
        slug = Path(name).stem
        identifier = meta_of(html, "identifier")
        if identifier:
            id_to_page_slug[identifier] = slug
        pairs = [("title", title_of(html))]
        if meta_of(html, "workflow_state") == "unpublished":
            pairs.append(("published", "false"))
        if meta_of(html, "front_page") == "true":
            pairs.append(("front_page", "true"))
        (pages_dir / f"{slug}.md").write_text(
            front_matter(pairs) + "\n\n" + body_of(html) + "\n", encoding="utf-8")

    # --- assignments -------------------------------------------------------
    manifest = ET.fromstring(read("imsmanifest.xml"))
    assignments_dir = out / "assignments"
    assignment_count = 0
    id_to_assignment_slug: dict[str, str] = {}
    for name in sorted(n for n in names if n.endswith("/assignment_settings.xml")
                       and not n.startswith("course_settings/")):
        folder = name.rsplit("/", 1)[0]
        a = ET.fromstring(read(name))
        html_name = next((n for n in names
                          if n.startswith(folder + "/") and n.endswith(".html")), None)
        body = body_of(read(html_name)) if html_name else ""
        slug = Path(html_name).stem if html_name else folder
        id_to_assignment_slug[a.get("identifier", folder)] = slug

        pairs = [("title", text_of(a, "title", slug))]
        group_ref = text_of(a, "assignment_group_identifierref")
        if group_ref and group_ref in group_titles:
            pairs.append(("group", group_titles[group_ref]))
        rubric_ref = text_of(a, "rubric_identifierref")
        if rubric_ref and rubric_ref in id_to_rubric_slug:
            pairs.append(("rubric", id_to_rubric_slug[rubric_ref]))
            if text_of(a, "rubric_use_for_grading") == "false":
                pairs.append(("rubric_use_for_grading", "false"))
            if text_of(a, "rubric_hide_points") == "true":
                pairs.append(("rubric_hide_points", "true"))
            if text_of(a, "rubric_hide_score_total") == "true":
                pairs.append(("rubric_hide_score_total", "true"))
        pairs += [
            ("points", text_of(a, "points_possible")),
            ("grading_type", text_of(a, "grading_type")),
            ("submission_types", text_of(a, "submission_types")),
            ("allowed_extensions", text_of(a, "allowed_extensions")),
            ("due", utc_z(text_of(a, "due_at"))),
            ("unlock", utc_z(text_of(a, "unlock_at"))),
            ("lock", utc_z(text_of(a, "lock_at"))),
            ("group_category", text_of(a, "group_category")
             if text_of(a, "has_group_category") == "true" else ""),
            ("peer_reviews", "true" if text_of(a, "peer_reviews") == "true" else ""),
            ("peer_review_count", text_of(a, "peer_review_count")
             if text_of(a, "peer_review_count") not in ("", "0") else ""),
            ("omit_from_final_grade",
             "true" if text_of(a, "omit_from_final_grade") == "true" else ""),
            ("published",
             "false" if text_of(a, "workflow_state") == "unpublished" else ""),
            ("position", text_of(a, "position")),
        ]
        assignments_dir.mkdir(exist_ok=True)
        (assignments_dir / f"{slug}.md").write_text(
            front_matter(pairs) + "\n\n" + body + "\n", encoding="utf-8")
        assignment_count += 1

    # Rewrite $WIKI_REFERENCE$ links from original ids to slugs so they
    # resolve after rebuilding with new identifiers.
    def rewrite_links(text: str) -> str:
        def sub(match: re.Match) -> str:
            return "$WIKI_REFERENCE$/pages/" + id_to_page_slug.get(match.group(1), match.group(1))
        return re.sub(r"\$WIKI_REFERENCE\$/pages/(g[0-9a-f]{32})", sub, text)

    for md in list(out.rglob("*.md")):
        content = md.read_text(encoding="utf-8")
        rewritten = rewrite_links(content)
        if rewritten != content:
            md.write_text(rewritten, encoding="utf-8")

    # --- modules.md --------------------------------------------------------
    if "course_settings/module_meta.xml" in names:
        modules_root = ET.fromstring(read("course_settings/module_meta.xml"))
        lines = []
        for module in modules_root.findall(f"{CC}module"):
            lines.append(f"# {text_of(module, 'title')}")
            for item in module.findall(f"{CC}items/{CC}item"):
                ctype = text_of(item, "content_type")
                item_title = text_of(item, "title")
                ref = text_of(item, "identifierref")
                if ctype == "WikiPage" and ref in id_to_page_slug:
                    lines.append(f"- page: {id_to_page_slug[ref]}")
                elif ctype == "Assignment" and ref in id_to_assignment_slug:
                    lines.append(f"- assignment: {id_to_assignment_slug[ref]}")
                elif ctype == "ContextModuleSubHeader":
                    lines.append(f"- header: {item_title}")
                elif ctype == "ExternalUrl":
                    lines.append(f"- url: {text_of(item, 'url')} | {item_title}")
                else:
                    lines.append(f"<!-- skipped unsupported module item: {ctype} {item_title!r} -->")
            lines.append("")
        if lines:
            (out / "modules.md").write_text("\n".join(lines), encoding="utf-8")

    # --- media -------------------------------------------------------------
    media = [n for n in names if n.startswith("web_resources/")]
    if include_media and media:
        for name in media:
            target = out / name
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_bytes(zf.read(name))

    print(f"Extracted to {out}")
    print(f"  pages:       {len(page_names)}")
    print(f"  assignments: {assignment_count}")
    print(f"  groups:      {len(group_titles)}")
    if id_to_rubric_slug:
        print(f"  rubrics:     {len(id_to_rubric_slug)}")
    if media and not include_media:
        print(f"  media:       {len(media)} files in web_resources/ skipped (use --include-media)")
    print(f"\nRebuild with: python3 tools/build_imscc.py {out}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Extract a Canvas .imscc export into editable markdown.")
    parser.add_argument("package", type=Path, help="path to the .imscc file")
    parser.add_argument("-o", "--output", type=Path, default=None,
                        help="output folder (default: <package-name>-source)")
    parser.add_argument("--include-media", action="store_true",
                        help="also extract web_resources/ media files (can be large)")
    args = parser.parse_args()
    if not args.package.is_file():
        sys.exit(f"error: {args.package} not found")
    out = args.output or args.package.parent / f"{args.package.stem}-source"
    extract(args.package, out.resolve(), args.include_media)


if __name__ == "__main__":
    main()
