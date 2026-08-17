#!/usr/bin/env python3
"""Build a Canvas-importable .imscc course package from a folder of markdown files.

Part of the canvas-design-agent project. Stdlib only — no pip installs needed.
Requires Python 3.9+.

Usage:
    python3 build_imscc.py <course-folder> [-o output.imscc]

Course folder layout (all files optional except course.md):

    course.md          course metadata (front matter). Body is ignored.
    groups.md          assignment groups: a markdown table (Group | Weight | Drop Lowest)
    syllabus.md        front matter ignored; body = syllabus HTML fragment
    modules.md         module structure (see below)
    assignments/*.md   one file per assignment: front matter + HTML body
    pages/*.md         one file per wiki page: front matter + HTML body
    web_resources/     files copied into the package (referenced via $IMS-CC-FILEBASE$)

Each .md body is a Canvas-safe HTML fragment (inline styles only), normally
generated with the Canvas Design Agent SKILL.md element library.

Identifiers are derived deterministically from the course code and each file's
slug, so re-building and re-importing the package UPDATES existing Canvas
content instead of duplicating it.

course.md front matter keys:
    title:        DIGF-2014-301 (Fall 2025) Atelier I: Discovery   (required)
    course_code:  DIGF-2014-301                                    (required)
    timezone:     America/Toronto        IANA name; default UTC

assignments/*.md front matter keys (all optional except title):
    title:             Workshop 1 - Feedback Session
    points:            100
    grading_type:      points | percent | letter_grade | gpa_scale | pass_fail | not_graded
    submission_types:  online_upload,online_url,online_text_entry,media_recording,on_paper,none
    allowed_extensions: pdf,zip
    due:               2025-09-17            (all-day: due 23:59:59 local)
                       2025-09-17 14:00      (specific local time)
                       2025-09-18T03:59:59Z  (explicit UTC)
    unlock:            same formats as due
    lock:              same formats as due
    group:             assignment group title (must match groups.md, else created unweighted)
    group_category:    student group set name (makes it a group assignment)
    published:         true | false          (default true)
    peer_reviews:      true | false
    peer_review_count: 2
    omit_from_final_grade: true | false
    position:          1                     (default: alphabetical file order)

pages/*.md front matter keys:
    title:        Class 1 - W September 3    (default: derived from filename)
    published:    true | false               (default true)
    front_page:   true                       (at most one page; sets course home page)

modules.md format:
    # Week 1
    - page: class-1-w-september-3
    - assignment: workshop-1-feedback-session
    - header: Optional text divider
    - url: https://example.com | Link Title

    # Week 2
    ...

Internal links inside HTML bodies should use Canvas export tokens:
    $WIKI_REFERENCE$/pages/<page-slug>
    $CANVAS_COURSE_REFERENCE$/assignments/...
    $IMS-CC-FILEBASE$images/photo.jpg
"""

from __future__ import annotations

import argparse
import hashlib
import re
import sys
import zipfile
from datetime import datetime, timedelta, timezone as dt_timezone
from pathlib import Path
from xml.dom import minidom
from xml.sax.saxutils import escape

try:
    from zoneinfo import ZoneInfo
except ImportError:  # pragma: no cover
    sys.exit("Python 3.9+ is required (zoneinfo not found).")

CC_NS = 'xmlns="http://canvas.instructure.com/xsd/cccv1p0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://canvas.instructure.com/xsd/cccv1p0 https://canvas.instructure.com/xsd/cccv1p0.xsd"'

VALID_GRADING_TYPES = {"points", "percent", "letter_grade", "gpa_scale", "pass_fail", "not_graded"}
VALID_SUBMISSION_TYPES = {
    "online_upload", "online_url", "online_text_entry", "media_recording",
    "student_annotation", "on_paper", "none", "external_tool", "discussion_topic",
}


# ---------------------------------------------------------------------------
# Small parsers
# ---------------------------------------------------------------------------

def parse_front_matter(text: str) -> tuple[dict, str]:
    """Parse a simple `key: value` front matter block delimited by --- lines.

    Returns (front_matter_dict, body). Values are kept as strings; callers
    coerce types. Only flat keys are supported.
    """
    if not text.startswith("---"):
        return {}, text
    lines = text.split("\n")
    fm: dict[str, str] = {}
    end = None
    for i, line in enumerate(lines[1:], start=1):
        if line.strip() == "---":
            end = i
            break
        if not line.strip() or line.strip().startswith("#"):
            continue
        if ":" not in line:
            raise ValueError(f"Bad front matter line (expected 'key: value'): {line!r}")
        key, _, value = line.partition(":")
        fm[key.strip().lower()] = value.strip()
    if end is None:
        raise ValueError("Front matter block not closed with '---'")
    body = "\n".join(lines[end + 1:]).strip()
    return fm, body


def parse_bool(value: str | None, default: bool) -> bool:
    if value is None or value == "":
        return default
    return value.strip().lower() in ("true", "yes", "1", "on")


def slugify(name: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")
    return slug or "item"


def stable_id(course_code: str, kind: str, slug: str) -> str:
    """Deterministic Canvas-style identifier: 'g' + 32 hex chars.

    Stable across rebuilds so Canvas re-imports update instead of duplicate.
    """
    digest = hashlib.md5(f"canvas-design-agent|{course_code}|{kind}|{slug}".encode()).hexdigest()
    return "g" + digest


def parse_datetime(value: str, tz: ZoneInfo) -> tuple[str, bool, str]:
    """Parse a due/unlock/lock value.

    Returns (utc_iso_no_suffix, all_day, all_day_date). Canvas exports store
    datetimes as UTC without a Z suffix.
    """
    value = value.strip()
    all_day = False
    all_day_date = ""
    if re.fullmatch(r"\d{4}-\d{2}-\d{2}", value):
        local = datetime.strptime(value, "%Y-%m-%d").replace(
            hour=23, minute=59, second=59, tzinfo=tz)
        all_day = True
        all_day_date = value
    elif value.endswith("Z") or "+" in value[10:]:
        local = datetime.fromisoformat(value.replace("Z", "+00:00"))
    else:
        naive = datetime.fromisoformat(value.replace(" ", "T"))
        local = naive.replace(tzinfo=tz)
    utc = local.astimezone(dt_timezone.utc)
    return utc.strftime("%Y-%m-%dT%H:%M:%S"), all_day, all_day_date


def parse_groups_table(text: str) -> list[dict]:
    """Parse the first markdown table in groups.md.

    Expected columns: Group | Weight | Drop Lowest (weight and drop optional).
    """
    groups = []
    for line in text.split("\n"):
        line = line.strip()
        if not line.startswith("|"):
            continue
        cells = [c.strip() for c in line.strip("|").split("|")]
        if not cells or set("".join(cells)) <= set("-: "):
            continue  # separator row
        if cells[0].lower() in ("group", "title", "name"):
            continue  # header row
        group = {"title": cells[0], "weight": None, "drop_lowest": 0}
        if len(cells) > 1 and cells[1]:
            group["weight"] = float(cells[1].rstrip("%"))
        if len(cells) > 2 and cells[2]:
            group["drop_lowest"] = int(cells[2])
        groups.append(group)
    return groups


def parse_modules(text: str) -> list[dict]:
    """Parse modules.md: '# Title' headings with '- kind: value' items."""
    text = re.sub(r"<!--.*?-->", "", text, flags=re.DOTALL)  # allow HTML comments
    modules: list[dict] = []
    for line in text.split("\n"):
        line = line.rstrip()
        heading = re.match(r"#+\s+(?:Module:\s*)?(.+)", line)
        if heading:
            modules.append({"title": heading.group(1).strip(), "items": []})
            continue
        item = re.match(r"[-*]\s+(\w+)\s*:\s*(.+)", line.strip())
        if item:
            if not modules:
                raise ValueError("modules.md: item found before any '# Module Title' heading")
            kind, value = item.group(1).lower(), item.group(2).strip()
            if kind not in ("page", "assignment", "header", "url"):
                raise ValueError(f"modules.md: unknown item type {kind!r} (use page, assignment, header, url)")
            modules[-1]["items"].append({"kind": kind, "value": value})
    return modules


# ---------------------------------------------------------------------------
# Content loading
# ---------------------------------------------------------------------------

def load_course(source: Path) -> dict:
    course_file = source / "course.md"
    if not course_file.exists():
        sys.exit(f"error: {course_file} not found — every course folder needs a course.md")
    fm, _ = parse_front_matter(course_file.read_text(encoding="utf-8"))
    if "title" not in fm or "course_code" not in fm:
        sys.exit("error: course.md front matter must include 'title' and 'course_code'")
    tz_name = fm.get("timezone", "UTC")
    try:
        tz = ZoneInfo(tz_name)
    except Exception:
        sys.exit(f"error: course.md timezone {tz_name!r} is not a valid IANA timezone name")
    return {"title": fm["title"], "course_code": fm["course_code"], "tz": tz}


def load_items(folder: Path, kind: str, course_code: str, tz: ZoneInfo) -> list[dict]:
    items = []
    if not folder.is_dir():
        return items
    for position, path in enumerate(sorted(folder.glob("*.md")), start=1):
        fm, body = parse_front_matter(path.read_text(encoding="utf-8"))
        slug = slugify(path.stem)
        title = fm.get("title") or path.stem.replace("-", " ").title()
        item = {
            "slug": slug,
            "title": title,
            "body": body,
            "fm": fm,
            "position": int(fm["position"]) if fm.get("position") else position,
            "identifier": stable_id(course_code, kind, slug),
            "published": parse_bool(fm.get("published"), True),
        }
        if kind == "assignment":
            grading_type = fm.get("grading_type", "points")
            if grading_type not in VALID_GRADING_TYPES:
                sys.exit(f"error: {path.name}: grading_type {grading_type!r} is not one of {sorted(VALID_GRADING_TYPES)}")
            sub_types = [s.strip() for s in fm.get("submission_types", "online_upload").split(",") if s.strip()]
            bad = set(sub_types) - VALID_SUBMISSION_TYPES
            if bad:
                sys.exit(f"error: {path.name}: unknown submission_types {sorted(bad)}")
            item.update({
                "points": float(fm.get("points", 100)),
                "grading_type": grading_type,
                "submission_types": ",".join(sub_types),
                "allowed_extensions": fm.get("allowed_extensions", ""),
                "group": fm.get("group", ""),
                "group_category": fm.get("group_category", ""),
                "peer_reviews": parse_bool(fm.get("peer_reviews"), False),
                "peer_review_count": int(fm.get("peer_review_count", 0)),
                "omit_from_final_grade": parse_bool(fm.get("omit_from_final_grade"), False),
            })
            for key in ("due", "unlock", "lock"):
                if fm.get(key):
                    try:
                        item[key] = parse_datetime(fm[key], tz)
                    except ValueError as err:
                        sys.exit(f"error: {path.name}: bad {key} date {fm[key]!r}: {err}")
                else:
                    item[key] = None
        if kind == "page":
            item["front_page"] = parse_bool(fm.get("front_page"), False)
        items.append(item)
    return items


# ---------------------------------------------------------------------------
# XML generation
# ---------------------------------------------------------------------------

def xml_assignment_settings(a: dict, group_ids: dict[str, str]) -> str:
    due, unlock, lock = a["due"], a["unlock"], a["lock"]
    group_ref = group_ids.get(a["group"], "")
    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        f'<assignment identifier="{a["identifier"]}" {CC_NS}>',
        f"  <title>{escape(a['title'])}</title>",
        f"  <due_at>{due[0] if due else ''}</due_at>",
        f"  <lock_at>{lock[0] if lock else ''}</lock_at>",
        f"  <unlock_at>{unlock[0] if unlock else ''}</unlock_at>",
        "  <module_locked>false</module_locked>",
    ]
    if due and due[1]:
        lines.append(f"  <all_day_date>{due[2]}</all_day_date>")
    if group_ref:
        lines.append(f"  <assignment_group_identifierref>{group_ref}</assignment_group_identifierref>")
    lines += [
        f"  <workflow_state>{'published' if a['published'] else 'unpublished'}</workflow_state>",
        f"  <allowed_extensions>{escape(a['allowed_extensions'])}</allowed_extensions>",
    ]
    if a["group_category"]:
        lines += [
            "  <has_group_category>true</has_group_category>",
            f"  <group_category>{escape(a['group_category'])}</group_category>",
        ]
    else:
        lines.append("  <has_group_category>false</has_group_category>")
    lines += [
        f"  <points_possible>{a['points']}</points_possible>",
        f"  <grading_type>{a['grading_type']}</grading_type>",
        f"  <all_day>{'true' if due and due[1] else 'false'}</all_day>",
        f"  <submission_types>{a['submission_types']}</submission_types>",
        f"  <position>{a['position']}</position>",
        f"  <peer_review_count>{a['peer_review_count']}</peer_review_count>",
        f"  <peer_reviews>{'true' if a['peer_reviews'] else 'false'}</peer_reviews>",
        "  <automatic_peer_reviews>false</automatic_peer_reviews>",
        "  <anonymous_peer_reviews>false</anonymous_peer_reviews>",
        "  <grade_group_students_individually>false</grade_group_students_individually>",
        "  <freeze_on_copy>false</freeze_on_copy>",
        f"  <omit_from_final_grade>{'true' if a['omit_from_final_grade'] else 'false'}</omit_from_final_grade>",
        "  <hide_in_gradebook>false</hide_in_gradebook>",
        "  <only_visible_to_overrides>false</only_visible_to_overrides>",
        "  <post_to_sis>false</post_to_sis>",
        "  <moderated_grading>false</moderated_grading>",
        "  <post_policy>",
        "    <post_manually>false</post_manually>",
        "  </post_policy>",
        "</assignment>",
    ]
    return "\n".join(lines) + "\n"


def xml_assignment_groups(groups: list[dict], group_ids: dict[str, str]) -> str:
    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        f"<assignmentGroups {CC_NS}>",
    ]
    for position, g in enumerate(groups, start=1):
        lines.append(f'  <assignmentGroup identifier="{group_ids[g["title"]]}">')
        lines.append(f"    <title>{escape(g['title'])}</title>")
        lines.append(f"    <position>{position}</position>")
        if g["weight"] is not None:
            lines.append(f"    <group_weight>{g['weight']}</group_weight>")
        if g["drop_lowest"]:
            lines += [
                "    <rules>",
                "      <rule>",
                "        <drop_type>drop_lowest</drop_type>",
                f"        <drop_count>{g['drop_lowest']}</drop_count>",
                "      </rule>",
                "    </rules>",
            ]
        lines.append("  </assignmentGroup>")
    lines.append("</assignmentGroups>")
    return "\n".join(lines) + "\n"


def xml_course_settings(course: dict, course_id: str, has_weights: bool, has_front_page: bool) -> str:
    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        f'<course identifier="{course_id}" {CC_NS}>',
        f"  <title>{escape(course['title'])}</title>",
        f"  <course_code>{escape(course['course_code'])}</course_code>",
        f"  <group_weighting_scheme>{'percent' if has_weights else 'points'}</group_weighting_scheme>",
        "  <is_public>false</is_public>",
        "  <syllabus_course_summary>true</syllabus_course_summary>",
        "  <default_wiki_editing_roles>teachers</default_wiki_editing_roles>",
    ]
    if has_front_page:
        lines.append("  <default_view>wiki</default_view>")
    lines.append("</course>")
    return "\n".join(lines) + "\n"


def xml_module_meta(modules: list[dict], course_code: str,
                    pages: dict[str, dict], assignments: dict[str, dict]) -> str:
    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        f"<modules {CC_NS}>",
    ]
    for m_pos, module in enumerate(modules, start=1):
        m_id = stable_id(course_code, "module", slugify(module["title"]))
        lines += [
            f'  <module identifier="{m_id}">',
            f"    <title>{escape(module['title'])}</title>",
            "    <workflow_state>active</workflow_state>",
            f"    <position>{m_pos}</position>",
            "    <require_sequential_progress>false</require_sequential_progress>",
            "    <locked>false</locked>",
            "    <items>",
        ]
        for i_pos, item in enumerate(module["items"], start=1):
            kind, value = item["kind"], item["value"]
            item_id = stable_id(course_code, "module-item", f"{slugify(module['title'])}-{i_pos}")
            if kind == "page":
                ref = pages.get(slugify(value))
                if not ref:
                    sys.exit(f"error: modules.md references unknown page {value!r}")
                content = ("WikiPage", ref["title"], ref["identifier"], None)
            elif kind == "assignment":
                ref = assignments.get(slugify(value))
                if not ref:
                    sys.exit(f"error: modules.md references unknown assignment {value!r}")
                content = ("Assignment", ref["title"], ref["identifier"], None)
            elif kind == "header":
                content = ("ContextModuleSubHeader", value, None, None)
            else:  # url
                url, _, url_title = value.partition("|")
                content = ("ExternalUrl", url_title.strip() or url.strip(), None, url.strip())
            content_type, title, identifierref, url = content
            lines += [
                f'      <item identifier="{item_id}">',
                f"        <content_type>{content_type}</content_type>",
                "        <workflow_state>active</workflow_state>",
                f"        <title>{escape(title)}</title>",
            ]
            if identifierref:
                lines.append(f"        <identifierref>{identifierref}</identifierref>")
            if url:
                lines.append(f"        <url>{escape(url)}</url>")
            lines += [
                f"        <position>{i_pos}</position>",
                "        <new_tab>false</new_tab>",
                "        <indent>0</indent>",
                "      </item>",
            ]
        lines += ["    </items>", "  </module>"]
    lines.append("</modules>")
    return "\n".join(lines) + "\n"


def html_wiki_page(page: dict) -> str:
    metas = [
        f'<meta name="identifier" content="{page["identifier"]}"/>',
        '<meta name="editing_roles" content="teachers"/>',
        f'<meta name="workflow_state" content="{"active" if page["published"] else "unpublished"}"/>',
    ]
    if page.get("front_page"):
        metas.append('<meta name="front_page" content="true"/>')
    return (
        "<html>\n<head>\n"
        '<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>\n'
        f"<title>{escape(page['title'])}</title>\n"
        + "\n".join(metas)
        + f"\n</head>\n<body>\n{page['body']}\n</body>\n</html>\n"
    )


def html_assignment(a: dict) -> str:
    return (
        "<html>\n<head>\n"
        '<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>\n'
        f"<title>Assignment: {escape(a['title'])}</title>\n"
        f"</head>\n<body>\n{a['body']}\n</body>\n</html>\n"
    )


def xml_manifest(course: dict, course_id: str, pages: list[dict], assignments: list[dict],
                 has_syllabus: bool, web_resource_paths: list[str]) -> str:
    export_date = datetime.now(dt_timezone.utc).strftime("%Y-%m-%d")
    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        f'<manifest identifier="{stable_id(course["course_code"], "manifest", "")}" '
        'xmlns="http://www.imsglobal.org/xsd/imsccv1p1/imscp_v1p1" '
        'xmlns:lom="http://ltsc.ieee.org/xsd/imsccv1p1/LOM/resource" '
        'xmlns:lomimscc="http://ltsc.ieee.org/xsd/imsccv1p1/LOM/manifest" '
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" '
        'xsi:schemaLocation="http://www.imsglobal.org/xsd/imsccv1p1/imscp_v1p1 '
        'http://www.imsglobal.org/profile/cc/ccv1p1/ccv1p1_imscp_v1p2_v1p0.xsd '
        'http://ltsc.ieee.org/xsd/imsccv1p1/LOM/resource '
        'http://www.imsglobal.org/profile/cc/ccv1p1/LOM/ccv1p1_lomresource_v1p0.xsd '
        'http://ltsc.ieee.org/xsd/imsccv1p1/LOM/manifest '
        'http://www.imsglobal.org/profile/cc/ccv1p1/LOM/ccv1p1_lommanifest_v1p0.xsd">',
        "  <metadata>",
        "    <schema>IMS Common Cartridge</schema>",
        "    <schemaversion>1.1.0</schemaversion>",
        "    <lomimscc:lom>",
        "      <lomimscc:general>",
        "        <lomimscc:title>",
        f"          <lomimscc:string>{escape(course['title'])}</lomimscc:string>",
        "        </lomimscc:title>",
        "      </lomimscc:general>",
        "      <lomimscc:lifeCycle>",
        "        <lomimscc:contribute>",
        "          <lomimscc:date>",
        f"            <lomimscc:dateTime>{export_date}</lomimscc:dateTime>",
        "          </lomimscc:date>",
        "        </lomimscc:contribute>",
        "      </lomimscc:lifeCycle>",
        "    </lomimscc:lom>",
        "  </metadata>",
        "  <organizations>",
        '    <organization identifier="org_1" structure="rooted-hierarchy">',
        '      <item identifier="LearningModules">',
        "      </item>",
        "    </organization>",
        "  </organizations>",
        "  <resources>",
    ]
    if has_syllabus:
        lines += [
            f'    <resource identifier="{course_id}_syllabus" '
            'type="associatedcontent/imscc_xmlv1p1/learning-application-resource" '
            'href="course_settings/syllabus.html" intendeduse="syllabus">',
            '      <file href="course_settings/syllabus.html"/>',
            "    </resource>",
        ]
    lines += [
        f'    <resource identifier="{course_id}" '
        'type="associatedcontent/imscc_xmlv1p1/learning-application-resource" '
        'href="course_settings/canvas_export.txt">',
        '      <file href="course_settings/course_settings.xml"/>',
        '      <file href="course_settings/assignment_groups.xml"/>',
        '      <file href="course_settings/module_meta.xml"/>',
        '      <file href="course_settings/canvas_export.txt"/>',
        "    </resource>",
    ]
    for page in pages:
        href = f"wiki_content/{page['slug']}.html"
        lines += [
            f'    <resource identifier="{page["identifier"]}" type="webcontent" href="{href}">',
            f'      <file href="{href}"/>',
            "    </resource>",
        ]
    for a in assignments:
        folder = a["identifier"]
        href = f"{folder}/{a['slug']}.html"
        lines += [
            f'    <resource identifier="{a["identifier"]}" '
            f'type="associatedcontent/imscc_xmlv1p1/learning-application-resource" href="{href}">',
            f'      <file href="{href}"/>',
            f'      <file href="{folder}/assignment_settings.xml"/>',
            "    </resource>",
        ]
    for rel in web_resource_paths:
        rid = stable_id(course["course_code"], "file", rel)
        lines += [
            f'    <resource identifier="{rid}" type="webcontent" href="web_resources/{rel}">',
            f'      <file href="web_resources/{rel}"/>',
            "    </resource>",
        ]
    lines += ["  </resources>", "</manifest>"]
    return "\n".join(lines) + "\n"


# ---------------------------------------------------------------------------
# Build
# ---------------------------------------------------------------------------

def build(source: Path, output: Path) -> None:
    course = load_course(source)
    code = course["course_code"]
    course_id = stable_id(code, "course", "")

    groups_file = source / "groups.md"
    groups = parse_groups_table(groups_file.read_text(encoding="utf-8")) if groups_file.exists() else []

    assignments = load_items(source / "assignments", "assignment", code, course["tz"])
    pages = load_items(source / "pages", "page", code, course["tz"])

    front_pages = [p for p in pages if p.get("front_page")]
    if len(front_pages) > 1:
        sys.exit("error: more than one page has front_page: true — only one home page is allowed")

    # Auto-create any assignment groups referenced but not defined in groups.md.
    defined = {g["title"] for g in groups}
    for a in assignments:
        if a["group"] and a["group"] not in defined:
            print(f"note: assignment group {a['group']!r} not in groups.md — adding it unweighted")
            groups.append({"title": a["group"], "weight": None, "drop_lowest": 0})
            defined.add(a["group"])
    group_ids = {g["title"]: stable_id(code, "assignment-group", slugify(g["title"])) for g in groups}

    syllabus_file = source / "syllabus.md"
    syllabus_body = None
    if syllabus_file.exists():
        _, syllabus_body = parse_front_matter(syllabus_file.read_text(encoding="utf-8"))

    modules_file = source / "modules.md"
    modules = parse_modules(modules_file.read_text(encoding="utf-8")) if modules_file.exists() else []

    web_dir = source / "web_resources"
    web_paths = sorted(str(p.relative_to(web_dir)) for p in web_dir.rglob("*")
                       if p.is_file() and not p.name.startswith(".")
                       and p.name.lower() != "readme.md") if web_dir.is_dir() else []

    pages_by_slug = {p["slug"]: p for p in pages}
    assignments_by_slug = {a["slug"]: a for a in assignments}
    has_weights = any(g["weight"] is not None for g in groups)

    # Canvas resolves $WIKI_REFERENCE$/pages/<id> links by migration identifier
    # on import. Rewrite slug-based links to identifiers for pages we ship, so
    # internal links survive even if a page's Canvas URL slug ends up different.
    def rewrite_wiki_links(body: str) -> str:
        def sub(match: re.Match) -> str:
            slug = match.group(1)
            page = pages_by_slug.get(slug)
            return "$WIKI_REFERENCE$/pages/" + (page["identifier"] if page else slug)
        return re.sub(r"\$WIKI_REFERENCE\$/pages/([A-Za-z0-9_\-]+)", sub, body)

    for item in list(pages) + list(assignments):
        item["body"] = rewrite_wiki_links(item["body"])
    if syllabus_body is not None:
        syllabus_body = rewrite_wiki_links(syllabus_body)

    files: dict[str, bytes] = {}

    def add(path: str, content: str, validate_xml: bool = False) -> None:
        if validate_xml:
            try:
                minidom.parseString(content)
            except Exception as err:
                sys.exit(f"internal error: generated invalid XML for {path}: {err}")
        files[path] = content.encode("utf-8")

    add("imsmanifest.xml",
        xml_manifest(course, course_id, pages, assignments, syllabus_body is not None, web_paths),
        validate_xml=True)
    add("course_settings/course_settings.xml",
        xml_course_settings(course, course_id, has_weights, bool(front_pages)), validate_xml=True)
    add("course_settings/assignment_groups.xml", xml_assignment_groups(groups, group_ids), validate_xml=True)
    add("course_settings/module_meta.xml",
        xml_module_meta(modules, code, pages_by_slug, assignments_by_slug), validate_xml=True)
    add("course_settings/canvas_export.txt",
        "Built by canvas-design-agent build_imscc.py\n")
    if syllabus_body is not None:
        add("course_settings/syllabus.html", syllabus_body)
    for page in pages:
        add(f"wiki_content/{page['slug']}.html", html_wiki_page(page))
    for a in assignments:
        add(f"{a['identifier']}/assignment_settings.xml", xml_assignment_settings(a, group_ids), validate_xml=True)
        add(f"{a['identifier']}/{a['slug']}.html", html_assignment(a))

    output.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(output, "w", zipfile.ZIP_DEFLATED) as zf:
        for path, content in sorted(files.items()):
            zf.writestr(path, content)
        for rel in web_paths:
            zf.write(web_dir / rel, f"web_resources/{rel}")

    print(f"Built {output}")
    print(f"  course:      {course['title']}")
    print(f"  pages:       {len(pages)}" + (f" (front page: {front_pages[0]['slug']})" if front_pages else ""))
    print(f"  assignments: {len(assignments)}")
    print(f"  groups:      {len(groups)}")
    print(f"  modules:     {len(modules)}")
    if web_paths:
        print(f"  files:       {len(web_paths)}")
    print("\nImport in Canvas: Settings -> Import Course Content -> "
          "'Canvas Course Export Package' -> select this file -> All Content.")
    print("Re-importing an updated build of the same course updates content in place.")


def main() -> None:
    parser = argparse.ArgumentParser(description="Build a Canvas .imscc package from a course folder.")
    parser.add_argument("source", type=Path, help="course source folder (contains course.md)")
    parser.add_argument("-o", "--output", type=Path, default=None,
                        help="output .imscc path (default: <source-name>.imscc next to the folder)")
    args = parser.parse_args()
    source = args.source.resolve()
    if not source.is_dir():
        sys.exit(f"error: {source} is not a directory")
    output = args.output or source.parent / f"{source.name}.imscc"
    build(source, output)


if __name__ == "__main__":
    main()
